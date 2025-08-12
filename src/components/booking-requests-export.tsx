import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface BookingRequest {
  id: string;
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
}

interface BookingRequestsExportProps {
  requests: BookingRequest[];
}

export const BookingRequestsExport = ({ requests }: BookingRequestsExportProps) => {
  const exportBookingRequests = () => {
    const worksheetData = requests.map(request => ({
      "Full Name": request.full_name,
      "Email": request.email,
      "Phone": request.phone || "N/A",
      "Access Type": request.access_option,
      "Equipment": request.selected_equipment.join(", "),
      "Requested Dates": request.selected_dates.join(", "),
      "Time Slots": request.selected_time_slots.join(", "),
      "Status": request.status,
      "Submitted Date": new Date(request.created_at).toLocaleDateString(),
      "Preferred Date": new Date(request.preferred_date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Booking Requests");
    XLSX.writeFile(workbook, `booking-requests-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Booking requests report exported successfully");
  };

  return (
    <Button onClick={exportBookingRequests} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Export Requests Report
    </Button>
  );
};