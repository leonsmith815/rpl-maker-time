import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingRequestsTab } from "@/components/booking-requests-tab";
import { ConfirmedBookingsTab } from "@/components/confirmed-bookings-tab";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Users, Clock, CheckCircle, Calendar } from "lucide-react";

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  confirmedBookings: number;
  thisWeekRequests: number;
}

interface TabCounts {
  requestsCount: number;
  confirmedCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    confirmedBookings: 0,
    thisWeekRequests: 0
  });
  const [tabCounts, setTabCounts] = useState<TabCounts>({
    requestsCount: 0,
    confirmedCount: 0
  });
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
      fetchStats();
    };

    checkAuth();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      // Fetch booking requests stats
      const { data: requests, error: requestsError } = await supabase
        .from("public_booking_requests")
        .select("created_at");

      if (requestsError) throw requestsError;

      // Fetch confirmed bookings stats  
      const { data: bookings, error: bookingsError } = await supabase
        .from("maker_lab_bookings")
        .select("created_at, status")
        .neq("status", "pending");

      if (bookingsError) throw bookingsError;

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      setStats({
        totalRequests: requests?.length || 0,
        pendingRequests: requests?.length || 0, // All in public_booking_requests are pending
        confirmedBookings: bookings?.length || 0,
        thisWeekRequests: requests?.filter(r => 
          new Date(r.created_at) > oneWeekAgo
        ).length || 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestsCountChange = (count: number) => {
    setTabCounts(prev => ({ ...prev, requestsCount: count }));
  };

  const handleConfirmedCountChange = (count: number) => {
    setTabCounts(prev => ({ ...prev, confirmedCount: count }));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
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
              <h1 className="text-3xl font-bold">Maker Lab Admin</h1>
              <p className="text-muted-foreground mt-1">Streamlined booking workflow management</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</div>
              <p className="text-xs text-muted-foreground">Approved & scheduled</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.thisWeekRequests}</div>
              <p className="text-xs text-muted-foreground">New requests</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalRequests}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Instructions */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Booking Workflow Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    1. Booking Requests
                  </Badge>
                  <span className="text-sm font-medium">Initial customer submissions</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">
                  Review customer details, equipment needs, and preferred dates. Export reports for administrative tracking.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    2. Confirmed Bookings
                  </Badge>
                  <span className="text-sm font-medium">Approved & scheduled sessions</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">
                  Manage confirmed appointments, update statuses, and track completion. Generate final booking reports.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Tabs */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="requests" className="text-base py-3">
              <Clock className="h-4 w-4 mr-2" />
              Booking Requests
              {tabCounts.requestsCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {tabCounts.requestsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="text-base py-3">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmed Bookings
              {tabCounts.confirmedCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {tabCounts.confirmedCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            <BookingRequestsTab onCountChange={handleRequestsCountChange} />
          </TabsContent>
          
          <TabsContent value="confirmed">
            <ConfirmedBookingsTab onCountChange={handleConfirmedCountChange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}