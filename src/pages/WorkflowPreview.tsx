import { WorkflowPreview } from "@/components/workflow-preview";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function WorkflowPreviewPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/admin")} 
            variant="outline" 
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Current Admin
          </Button>
        </div>
        
        <WorkflowPreview />
        
        <div className="text-center mt-8 space-y-4">
          <h3 className="text-xl font-bold">Ready to Proceed?</h3>
          <p className="text-muted-foreground">
            This update will implement the streamlined booking workflow as shown above.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This will replace your current admin dashboard with the new streamlined version.
          </p>
        </div>
      </div>
    </div>
  );
}