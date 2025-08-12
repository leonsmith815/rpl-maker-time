import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, Download, Users, Mail, FileText } from "lucide-react";

export const WorkflowPreview = () => {
  return (
    <div className="space-y-8 p-6 bg-background">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Streamlined Booking Workflow Preview</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Clear separation between booking requests and confirmed bookings with distinct reporting capabilities.
        </p>
      </div>

      {/* Workflow Stages */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Stage 1: Booking Requests */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Stage 1: Booking Requests
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending Review</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">What You'll See:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Customer name, email, phone</li>
                <li>• Equipment requirements</li>
                <li>• Preferred dates and time slots</li>
                <li>• Access type (Training/Appointment)</li>
                <li>• Submission timestamp</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Actions Available:</h4>
              <div className="flex gap-2">
                <Button size="sm" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Approve & Schedule
                </Button>
                <Button size="sm" variant="destructive" className="gap-1">
                  Reject Request
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Requests Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stage 2: Confirmed Bookings */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Stage 2: Confirmed Bookings
              <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">What You'll See:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• All booking request details</li>
                <li>• Confirmation timestamp</li>
                <li>• Current status (Scheduled/Completed/etc.)</li>
                <li>• Staff approver information</li>
                <li>• Last action date</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Status Management:</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="default">Scheduled</Badge>
                <Badge variant="default">Completed</Badge>
                <Badge variant="destructive">Cancelled</Badge>
                <Badge variant="secondary">Missed</Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Bookings Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Process */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Automated Workflow Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-sm font-medium">Customer Submits</p>
              </div>
              
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Appears in Requests</p>
              </div>
              
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Admin Approves</p>
              </div>
              
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Moves to Confirmed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Booking Requests Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="font-medium">Will Include:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Name, Email, Phone</li>
                <li>• Requested Date/Time</li>
                <li>• Equipment Requirements</li>
                <li>• Current Status</li>
                <li>• Submission Date</li>
              </ul>
              <Badge variant="secondary" className="mt-2">CSV/Excel Export</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Confirmed Bookings Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="font-medium">Will Include:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• All request details</li>
                <li>• Confirmation Timestamp</li>
                <li>• Staff Approver</li>
                <li>• Final Status</li>
                <li>• Completion Date</li>
              </ul>
              <Badge variant="secondary" className="mt-2">CSV/Excel Export</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Estimate */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="text-center py-6">
          <h3 className="text-xl font-bold mb-2">Implementation Estimate</h3>
          <p className="text-muted-foreground mb-4">
            This streamlined workflow will cost approximately <span className="font-bold text-lg">25-30 credits</span> to implement.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Complete separation of booking requests and confirmed bookings</p>
            <p>• Automated workflow with email notifications</p>
            <p>• Distinct reporting capabilities for each stage</p>
            <p>• Clean, intuitive admin interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};