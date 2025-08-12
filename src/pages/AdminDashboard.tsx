import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingRequestsTab } from "@/components/booking-requests-tab";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, LogOut, FileText, Users, ChevronDown, Trash2, CalendarIcon, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { sendStatusUpdateEmail } from "@/services/emailService";

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
  is_deleted?: boolean;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [deletedBookings, setDeletedBookings] = useState<Set<string>>(new Set());
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

  const updateBookingStatus = async (bookingId: string, newStatus: string, scheduledDate?: Date, scheduledTime?: string) => {
    try {
      let actionDate = scheduledDate ? scheduledDate.toISOString() : new Date().toISOString();
      
      // If time is provided, combine it with the date
      if (scheduledDate && scheduledTime) {
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const dateWithTime = new Date(scheduledDate);
        dateWithTime.setHours(hours, minutes, 0, 0);
        actionDate = dateWithTime.toISOString();
      }
      
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

      // Find the booking to get customer details for email
      const booking = bookings.find(b => b.id === bookingId);
      console.log("🔍 Found booking for email:", booking);
      
      if (booking) {
        // Send email notification using EmailJS from frontend
        console.log("📧 Attempting to send email notification...");
        try {
          const emailPayload = {
            email: booking.email,
            fullName: booking.full_name,
            status: newStatus,
            selectedDates: booking.selected_dates,
            selectedTimeSlots: booking.selected_time_slots,
            selectedEquipment: booking.selected_equipment,
            actionDate: actionDate
          };
          
          console.log("📤 Email payload:", emailPayload);
          
          await sendStatusUpdateEmail(emailPayload);
          console.log("✅ Email notification sent successfully");
        } catch (emailError) {
          console.error("❌ Error sending email notification:", emailError);
          // Don't fail the status update if email fails
        }
      } else {
        console.log("⚠️ No booking found for email notification");
      }

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, action_date: actionDate }
          : booking
      ));

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}${scheduledDate ? ` for ${format(scheduledDate, 'PPP')}${scheduledTime ? ` at ${scheduledTime}` : ''}` : ''}. Email notification sent to customer.`,
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
    const [time, setTime] = useState<string>("");
    const [open, setOpen] = useState(false);

    const handleSchedule = () => {
      if (date) {
        updateBookingStatus(bookingId, "scheduled", date, time);
        setOpen(false);
        setDate(undefined);
        setTime("");
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
            <h4 className="font-medium">Select Schedule Date & Time</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="space-y-2">
              <Label htmlFor="schedule-time" className="text-sm font-medium">
                <Clock className="h-4 w-4 inline mr-1" />
                Appointment Time
              </Label>
              <Input
                id="schedule-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
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
    const [time, setTime] = useState<string>("");
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
      if (date) {
        updateBookingStatus(bookingId, "cancelled", date, time);
        setOpen(false);
        setDate(undefined);
        setTime("");
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
            <h4 className="font-medium">Select Cancellation Date & Time</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="space-y-2">
              <Label htmlFor="cancel-time" className="text-sm font-medium">
                <Clock className="h-4 w-4 inline mr-1" />
                Cancellation Time
              </Label>
              <Input
                id="cancel-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
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
    const [time, setTime] = useState<string>("");
    const [open, setOpen] = useState(false);

    const handleMissed = () => {
      if (date) {
        updateBookingStatus(bookingId, "missed", date, time);
        setOpen(false);
        setDate(undefined);
        setTime("");
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
            <h4 className="font-medium">Select Missed Date & Time</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="space-y-2">
              <Label htmlFor="missed-time" className="text-sm font-medium">
                <Clock className="h-4 w-4 inline mr-1" />
                Missed Time
              </Label>
              <Input
                id="missed-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
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

  const markBookingForDeletion = (bookingId: string, bookingName: string) => {
    setDeletedBookings(prev => new Set(prev).add(bookingId));
    
    toast({
      title: "Booking Marked for Deletion",
      description: `${bookingName}'s booking is marked for deletion. Click delete again to permanently remove.`,
      variant: "destructive",
    });
  };

  const undoBookingDeletion = (bookingId: string, bookingName: string) => {
    setDeletedBookings(prev => {
      const newSet = new Set(prev);
      newSet.delete(bookingId);
      return newSet;
    });
    
    toast({
      title: "Deletion Undone",
      description: `${bookingName}'s booking has been restored.`,
    });
  };

  const deleteBookingPermanently = async (bookingId: string, bookingName: string) => {
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
      setDeletedBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });

      toast({
        title: "Booking Permanently Deleted",
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

  const deleteSelectedBookings = async () => {
    if (selectedBookings.length === 0) return;

    try {
      const { error } = await supabase
        .from("maker_lab_bookings")
        .delete()
        .in("id", selectedBookings);

      if (error) {
        throw error;
      }

      // Update local state by removing the deleted bookings
      setBookings(bookings.filter(booking => !selectedBookings.includes(booking.id)));
      setSelectedBookings([]);

      toast({
        title: "Bookings Deleted",
        description: `${selectedBookings.length} bookings have been permanently deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected bookings",
        variant: "destructive",
      });
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
      booking.action_date ? new Date(booking.action_date).toLocaleDateString() + " " + 
        new Date(booking.action_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Access", "Equipment", "Dates", "Times", "Status", "Submitted", "Action Date & Time"]],
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
        9: { cellWidth: 25 }, // Action Date & Time
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

        {/* Export Buttons and Bulk Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Button onClick={exportToExcel} className="gap-2">
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export to PDF
            </Button>
          </div>
          
          {selectedBookings.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedBookings.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Bookings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete {selectedBookings.length} selected booking{selectedBookings.length > 1 ? 's' : ''} and remove all associated data from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={deleteSelectedBookings}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Tabs for Requests and Confirmed Bookings */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Booking Requests</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            <BookingRequestsTab />
          </TabsContent>
          
          <TabsContent value="confirmed">
            {/* Confirmed Bookings Table */}
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Bookings</CardTitle>
              </CardHeader>
              <CardContent>
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
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={() => toggleBookingSelection(booking.id)}
                          aria-label={`Select ${booking.full_name}'s booking`}
                        />
                      </TableCell>
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
                             ? new Date(booking.action_date).toLocaleDateString() + " " + 
                               new Date(booking.action_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                             : "N/A"
                           }
                         </TableCell>
                         <TableCell>
                           {deletedBookings.has(booking.id) ? (
                             <div className="flex gap-2">
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 onClick={() => undoBookingDeletion(booking.id, booking.full_name)}
                                 className="gap-2"
                               >
                                 Undo
                               </Button>
                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                   <Button 
                                     variant="destructive" 
                                     size="sm"
                                     className="gap-2"
                                   >
                                     <Trash2 className="h-4 w-4" />
                                     Delete Permanently
                                   </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                   <AlertDialogHeader>
                                     <AlertDialogTitle>Permanently Delete Booking?</AlertDialogTitle>
                                     <AlertDialogDescription>
                                       This action cannot be undone. This will permanently delete {booking.full_name}'s booking request and remove all associated data from the database.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                                     <AlertDialogAction 
                                       onClick={() => deleteBookingPermanently(booking.id, booking.full_name)}
                                       className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                     >
                                       Delete Permanently
                                     </AlertDialogAction>
                                   </AlertDialogFooter>
                                 </AlertDialogContent>
                               </AlertDialog>
                             </div>
                           ) : (
                             <Button 
                               variant="destructive" 
                               size="sm"
                               onClick={() => markBookingForDeletion(booking.id, booking.full_name)}
                               className="gap-2"
                             >
                               <Trash2 className="h-4 w-4" />
                               Delete
                             </Button>
                           )}
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
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
