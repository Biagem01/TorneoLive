import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

interface TournamentFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
}

export default function TournamentForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  });

const createTournamentMutation = useMutation({
  mutationFn: async (data: TournamentFormData) => {
    return await apiRequest("POST", "/api/tournaments", {
      name: data.name,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    status: data.status,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    setFormData({ name: "", startDate: "", endDate: "", status: "upcoming" });
    toast({
      title: "Tournament created successfully",
      description: "The tournament has been added to the system.",
    });
  },
  onError: () => {
    toast({
      title: "Error",
      description: "Failed to create tournament. Please try again.",
      variant: "destructive",
    });
  },
});



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: "Validation Error",
        description: "End date cannot be before start date.",
        variant: "destructive",
      });
      return;
    }

    createTournamentMutation.mutate(formData);
  };

  const isFormIncomplete =
    !formData.name || !formData.startDate || !formData.endDate;

  return (
    <Card className="p-6 max-w-2xl" data-testid="card-tournament-form">
      <h2 className="text-2xl font-bold mb-6">Create Tournament</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Tournament Name</Label>
          <Input
            id="name"
            placeholder="Summer League 2024"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            data-testid="input-tournament-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as TournamentFormData["status"] })
            }
          >
            <SelectTrigger data-testid="select-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                data-testid="input-start-date"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                data-testid="input-end-date"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ name: "", startDate: "", endDate: "", status: "upcoming" })}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isFormIncomplete || createTournamentMutation.isPending}
            data-testid="button-create-tournament"
          >
            {createTournamentMutation.isPending ? "Creating..." : "Create Tournament"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
