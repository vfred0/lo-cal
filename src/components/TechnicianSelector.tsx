import { useState, useEffect } from "react";
import { Technician } from "@/event/types";

type TechnicianSelectorProps = {
  value?: string;
  onChange: (technicianId: string) => void;
};

// Default technicians to populate the selector
const DEFAULT_TECHNICIANS: Technician[] = [
  { id: "tech-1", name: "John Doe" },
  { id: "tech-2", name: "Jane Smith" },
  { id: "tech-3", name: "Alex Johnson" },
];

export default function TechnicianSelector({ value, onChange }: TechnicianSelectorProps) {
  const [technicians, setTechnicians] = useState<Technician[]>(DEFAULT_TECHNICIANS);

  // Handle the selection change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="technician-selector">
      <select 
        value={value || ""} 
        onChange={handleChange}
        className="form-select"
      >
        <option value="">Select a technician</option>
        {technicians.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.name}
          </option>
        ))}
      </select>
    </div>
  );
}