import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const exportToExcel = () => {
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
    
    toast.success("Booking requests Excel report exported successfully");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(20);
    doc.text("Booking Requests Report", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Requests: ${requests.length}`, 20, 35);

    const tableData = requests.map(request => [
      request.full_name,
      request.email,
      request.phone || "N/A",
      request.access_option,
      request.selected_equipment.join(", "),
      request.selected_dates.join("\n"),
      request.selected_time_slots.join("\n"),
      request.status,
      new Date(request.created_at).toLocaleDateString(),
      new Date(request.preferred_date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Access", "Equipment", "Requested Dates", "Time Slots", "Status", "Submitted", "Preferred Date"]],
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
        8: { cellWidth: 20 }, // Submitted
        9: { cellWidth: 20 }, // Preferred Date
      },
      headStyles: {
        fontSize: 9,
        fontStyle: 'bold',
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`booking-requests-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success("Booking requests PDF report exported successfully");
  };

  return (
    <div className="flex gap-2">
      <Button onClick={exportToExcel} variant="outline" className="gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button onClick={exportToPDF} variant="outline" className="gap-2">
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
};