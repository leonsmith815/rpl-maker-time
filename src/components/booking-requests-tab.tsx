import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Settings, User, Mail, Phone, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

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

export const BookingRequestsTab = () => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('public_booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to fetch booking requests');
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch booking requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (requestId: string) => {
    try {
      console.log('🚀 Approving request:', requestId);
      
      // Call the database function to promote the request to a confirmed booking
      const { data, error } = await supabase.rpc('promote_booking_request_to_confirmed', {
        request_id: requestId,
        assigned_user_id: null // Could assign to a specific user if needed
      });

      console.log('📥 RPC Response:', { data, error });

      if (error) {
        console.error('❌ Error approving request:', error);
        toast.error(`Failed to approve booking request: ${error.message}`);
        return;
      }

      console.log('✅ Booking promoted with ID:', data);
      toast.success('Booking request approved and moved to confirmed bookings');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      toast.error(`Failed to approve booking request: ${error.message || 'Unknown error'}`);
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('public_booking_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error('Error rejecting request:', error);
        toast.error('Failed to reject booking request');
        return;
      }

      toast.success('Booking request rejected');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to reject booking request');
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">No pending booking requests</h3>
        <p className="text-sm text-muted-foreground mt-2">New booking requests will appear here for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pending Booking Requests</h2>
        <Badge variant="secondary">{requests.length} requests</Badge>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {request.full_name}
                </CardTitle>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email:</span>
                    <span>{request.email}</span>
                  </div>
                  {request.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Phone:</span>
                      <span>{request.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Access Type:</span>
                    <Badge variant="secondary">{request.access_option}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Preferred Date:</span>
                    <span>{new Date(request.preferred_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Submitted:</span>
                    <span className="ml-2">{new Date(request.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Requested Dates:</span>
                </div>
                <div className="pl-6 text-sm text-muted-foreground">
                  {request.selected_dates.join(', ')}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Time Slots:</span>
                </div>
                <div className="pl-6 text-sm text-muted-foreground">
                  {request.selected_time_slots.join(', ')}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Equipment:</span>
                </div>
                <div className="pl-6 text-sm text-muted-foreground">
                  {request.selected_equipment.join(', ')}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => approveRequest(request.id)}
                  className="flex-1"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Schedule
                </Button>
                <Button
                  onClick={() => rejectRequest(request.id)}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};