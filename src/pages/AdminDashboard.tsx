import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, LogOut, FileText, Users } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  access_option: string;
  selected_equipment: string[];
  selected_dates: string[];
  selected_time_slots: string[];
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/admin-auth");
        return;
      }

      // Check if user has admin role
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (userRole?.role !== "admin") {
        navigate("/admin-auth");
        return;
      }

      setIsAdmin(true);
      fetchBookings();
    };

    checkAuth();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("maker_lab_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  const exportToExcel = () => {
    const worksheetData = bookings.map(booking => ({
      "Full Name": booking.full_name,
      "Email": booking.email,
      "Phone": booking.phone || "N/A",
      "Access Type": booking.access_option,
      "Equipment": booking.selected_equipment.join(", "),
      "Dates": booking.selected_dates.join(", "),
      "Time Slots": booking.selected_time_slots.join(", "),
      "Status": booking.status,
      "Submitted": new Date(booking.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, `maker-lab-bookings-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Complete",
      description: "Excel file has been downloaded",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(20);
    doc.text("Maker Lab Booking Requests", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    const tableData = bookings.map(booking => [
      booking.full_name,
      booking.email,
      booking.phone || "N/A",
      booking.access_option,
      booking.selected_equipment.join(", "),
      booking.selected_dates.join(", "),
      booking.selected_time_slots.join(", "),
      booking.status,
      new Date(booking.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Access", "Equipment", "Dates", "Times", "Status", "Submitted"]],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      columnStyles: {
        1: { cellWidth: 35 },
        2: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
      },
    });

    doc.save(`maker-lab-bookings-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Export Complete",
      description: "PDF file has been downloaded",
    });
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage Maker Lab booking requests</p>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(b => b.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(b => 
                  new Date(b.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={exportToExcel} className="gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export to PDF
          </Button>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Access Type</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Times</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.full_name}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={booking.access_option === "training" ? "default" : "secondary"}>
                          {booking.access_option}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48 truncate">
                          {booking.selected_equipment.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate">
                          {booking.selected_dates.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate">
                          {booking.selected_time_slots.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === "pending" ? "outline" : "default"}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {bookings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No booking requests found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}