import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, User, Mail, Phone, ChevronDown, Trash2, CheckCircle, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ConfirmedBooking {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  access_option: string;
  selected_dates: string[];
  selected_time_slots: string[];
  selected_equipment: string[];
  preferred_date: string;
  status: string;
  created_at: string;
  action_date: string | null;
}

export const ConfirmedBookingsTab = () => {
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  const fetchConfirmedBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('maker_lab_bookings')
        .select('*')
        .neq('status', 'pending') // Only get confirmed/scheduled/completed bookings
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching confirmed bookings:', error);
        toast.error('Failed to fetch confirmed bookings');
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch confirmed bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('maker_lab_bookings')
        .update({ 
          status: newStatus,
          action_date: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        toast.error('Failed to update booking status');
        return;
      }

      toast.success(`Booking status updated to ${newStatus}`);
      fetchConfirmedBookings(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update booking status');
    }
  };

  const deleteSelectedBookings = async () => {
    if (selectedBookings.length === 0) return;

    try {
      const { error } = await supabase
        .from('maker_lab_bookings')
        .delete()
        .in('id', selectedBookings);

      if (error) {
        console.error('Error deleting bookings:', error);
        toast.error('Failed to delete bookings');
        return;
      }

      toast.success(`${selectedBookings.length} bookings deleted successfully`);
      setSelectedBookings([]);
      fetchConfirmedBookings();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete bookings');
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map(booking => booking.id));
    }
  };

  const exportToExcel = () => {
    const worksheetData = bookings.map(booking => ({
      "Full Name": booking.full_name,
      "Email": booking.email,
      "Phone": booking.phone || "N/A",
      "Access Type": booking.access_option,
      "Equipment": booking.selected_equipment.join(", "),
      "Requested Dates": booking.selected_dates.join(", "),
      "Time Slots": booking.selected_time_slots.join(", "),
      "Status": booking.status,
      "Confirmation Date": new Date(booking.created_at).toLocaleDateString(),
      "Last Action Date": booking.action_date ? new Date(booking.action_date).toLocaleDateString() : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Confirmed Bookings");
    XLSX.writeFile(workbook, `confirmed-bookings-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Confirmed bookings Excel report exported successfully");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(20);
    doc.text("Confirmed Bookings Report", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Confirmed Bookings: ${bookings.length}`, 20, 35);

    const tableData = bookings.map(booking => [
      booking.full_name,
      booking.email,
      booking.phone || "N/A",
      booking.access_option,
      booking.selected_equipment.join(", "),
      booking.selected_dates.join("\n"),
      booking.selected_time_slots.join("\n"),
      booking.status,
      new Date(booking.created_at).toLocaleDateString(),
      booking.action_date ? new Date(booking.action_date).toLocaleDateString() : "N/A",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Access", "Equipment", "Requested Dates", "Time Slots", "Status", "Confirmed", "Last Action"]],
      body: tableData,
      startY: 45,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Name
        1: { cellWidth: 35 }, // Email
        2: { cellWidth: 20 }, // Phone
        3: { cellWidth: 20 }, // Access
        4: { cellWidth: 30 }, // Equipment
        5: { cellWidth: 35 }, // Requested Dates
        6: { cellWidth: 35 }, // Time Slots
        7: { cellWidth: 20 }, // Status
        8: { cellWidth: 20 }, // Confirmed
        9: { cellWidth: 20 }, // Last Action
      },
      headStyles: {
        fontSize: 9,
        fontStyle: 'bold',
        fillColor: [34, 139, 34],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`confirmed-bookings-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success("Confirmed bookings PDF report exported successfully");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'missed': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Confirmed Bookings</h2>
          <Badge variant="secondary">{bookings.length} confirmed</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          
          {selectedBookings.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedBookings.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Bookings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete {selectedBookings.length} selected booking{selectedBookings.length > 1 ? 's' : ''}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteSelectedBookings} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No confirmed bookings</h3>
          <p className="text-sm text-muted-foreground mt-2">Approved booking requests will appear here.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedBookings.length === bookings.length && bookings.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all bookings"
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Access Type</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Requested Dates</TableHead>
                    <TableHead>Time Slots</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confirmed</TableHead>
                    <TableHead>Last Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={() => toggleBookingSelection(booking.id)}
                          aria-label={`Select ${booking.full_name}'s booking`}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{booking.full_name}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{booking.email}</span>
                          </div>
                          {booking.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{booking.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={booking.access_option === "training" ? "default" : "secondary"}>
                          {booking.access_option}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-48 truncate text-sm">
                          {booking.selected_equipment.join(", ")}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-48 text-sm">
                          {booking.selected_dates.slice(0, 2).map((date, index) => (
                            <div key={index}>{date}</div>
                          ))}
                          {booking.selected_dates.length > 2 && (
                            <div className="text-muted-foreground">+{booking.selected_dates.length - 2} more</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-48 text-sm">
                          {booking.selected_time_slots.slice(0, 2).map((slot, index) => (
                            <div key={index}>{slot}</div>
                          ))}
                          {booking.selected_time_slots.length > 2 && (
                            <div className="text-muted-foreground">+{booking.selected_time_slots.length - 2} more</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2 min-w-24 justify-between"
                            >
                              <Badge variant={getStatusBadgeVariant(booking.status)}>
                                {booking.status}
                              </Badge>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "scheduled")}>
                              Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "completed")}>
                              Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "cancelled")}>
                              Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "missed")}>
                              Missed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {booking.action_date ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {new Date(booking.action_date).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};