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
import { Download, LogOut, FileText, Users, ChevronDown, Trash2, CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
  action_date: string | null;
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
      console.log("Booking data:", data?.slice(0, 2).map(b => ({ 
        id: b.id, 
        name: b.full_name, 
        selected_dates: b.selected_dates,
        dateTypes: b.selected_dates?.map(d => typeof d)
      })));
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

  const updateBookingStatus = async (bookingId: string, newStatus: string, scheduledDate?: Date) => {
    try {
      const actionDate = scheduledDate ? scheduledDate.toISOString() : new Date().toISOString();
      
      const { error } = await supabase
        .from("maker_lab_bookings")
        .update({ 
          status: newStatus,
          action_date: actionDate
        })
        .eq("id", bookingId);

      if (error) {
        throw error;
      }

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, action_date: actionDate }
          : booking
      ));

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}${scheduledDate ? ` for ${format(scheduledDate, 'PPP')}` : ''}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const ScheduleButton = ({ bookingId }: { bookingId: string }) => {
    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState(false);

    const handleSchedule = () => {
      if (date) {
        updateBookingStatus(bookingId, "scheduled", date);
        setOpen(false);
        setDate(undefined);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="cursor-pointer w-full justify-start">
            Scheduled
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <h4 className="font-medium">Select Schedule Date</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSchedule} 
                disabled={!date}
                size="sm"
                className="flex-1"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button 
                onClick={() => setOpen(false)} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const CancelButton = ({ bookingId }: { bookingId: string }) => {
    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
      if (date) {
        updateBookingStatus(bookingId, "cancelled", date);
        setOpen(false);
        setDate(undefined);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="cursor-pointer w-full justify-start">
            Cancelled
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <h4 className="font-medium">Select Cancellation Date</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleCancel} 
                disabled={!date}
                size="sm"
                className="flex-1"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
              <Button 
                onClick={() => setOpen(false)} 
                variant="outline" 
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const MissedButton = ({ bookingId }: { bookingId: string }) => {
    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState(false);

    const handleMissed = () => {
      if (date) {
        updateBookingStatus(bookingId, "missed", date);
        setOpen(false);
        setDate(undefined);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="cursor-pointer w-full justify-start">
            Missed
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <h4 className="font-medium">Select Missed Date</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleMissed} 
                disabled={!date}
                size="sm"
                className="flex-1"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Mark Missed
              </Button>
              <Button 
                onClick={() => setOpen(false)} 
                variant="outline" 
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const deleteBooking = async (bookingId: string, bookingName: string) => {
    try {
      const { error } = await supabase
        .from("maker_lab_bookings")
        .delete()
        .eq("id", bookingId);

      if (error) {
        throw error;
      }

      // Update local state by removing the deleted booking
      setBookings(bookings.filter(booking => booking.id !== bookingId));

      toast({
        title: "Booking Deleted",
        description: `${bookingName}'s booking has been permanently deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
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

    const formatDates = (dates: string[]) => {
      return dates.map(dateStr => {
        try {
          // Handle both ISO format and long format dates
          if (dateStr.includes('-') && dateStr.length === 10) {
            // ISO format: convert to long format
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
              return d.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
            }
          }
          // Already in long format or handle as-is
          return dateStr;
        } catch (error) {
          return dateStr;
        }
      }).join('\n');
    };

    const formatTimes = (times: string[]) => {
      return times.join('\n');
    };

    const tableData = bookings.map(booking => [
      booking.full_name,
      booking.email,
      booking.phone || "N/A",
      booking.access_option,
      booking.selected_equipment.join(", "),
      formatDates(booking.selected_dates),
      formatTimes(booking.selected_time_slots),
      booking.status,
      new Date(booking.created_at).toLocaleDateString(),
      booking.action_date ? new Date(booking.action_date).toLocaleDateString() : "N/A",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Access", "Equipment", "Dates", "Times", "Status", "Submitted", "Action Date"]],
      body: tableData,
      startY: 40,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        1: { cellWidth: 30 }, // Email
        2: { cellWidth: 20 }, // Phone
        4: { cellWidth: 25 }, // Equipment
        5: { cellWidth: 35 }, // Dates
        6: { cellWidth: 35 }, // Times
        8: { cellWidth: 20 }, // Submitted
        9: { cellWidth: 20 }, // Action Date
      },
      headStyles: {
        fontSize: 9,
        fontStyle: 'bold',
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
                     <TableHead>Action</TableHead>
                     <TableHead>Delete</TableHead>
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
                        <div className="max-w-48 text-sm">
                          {booking.selected_dates.map((dateStr, index) => {
                            try {
                              // Handle both ISO format and long format dates
                              let displayDate = dateStr;
                              if (dateStr.includes('-') && dateStr.length === 10) {
                                // ISO format: convert to long format
                                const d = new Date(dateStr);
                                if (!isNaN(d.getTime())) {
                                  displayDate = d.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  });
                                }
                              }
                              return <div key={index}>{displayDate}</div>;
                            } catch (error) {
                              return <div key={index}>{dateStr}</div>;
                            }
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48 text-sm">
                          {booking.selected_time_slots.map((timeSlot, index) => (
                            <div key={index}>{timeSlot}</div>
                          ))}
                        </div>
                      </TableCell>
                       <TableCell>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="gap-2 min-w-24 justify-between bg-card"
                             >
                               <Badge variant={booking.status === "pending" ? "outline" : "default"}>
                                 {booking.status}
                               </Badge>
                               <ChevronDown className="h-3 w-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent className="bg-card border shadow-lg z-50">
                             <DropdownMenuItem 
                               onClick={() => updateBookingStatus(booking.id, "pending")}
                               className="cursor-pointer"
                             >
                               Pending
                             </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <ScheduleButton bookingId={booking.id} />
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <MissedButton bookingId={booking.id} />
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <CancelButton bookingId={booking.id} />
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                       <TableCell>
                         {new Date(booking.created_at).toLocaleDateString()}
                       </TableCell>
                        <TableCell>
                          {booking.action_date 
                            ? new Date(booking.action_date).toLocaleDateString()
                            : "N/A"
                          }
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete {booking.full_name}'s booking request and remove all associated data from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteBooking(booking.id, booking.full_name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Permanently
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
