import { PERSONAS } from "@/lib/personas";

export default function AdminPersonasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Personas</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2">ID</th>
            <th>Name</th>
            <th>Rubric</th>
            <th>Env key</th>
          </tr>
        </thead>
        <tbody>
          {PERSONAS.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2 font-mono text-xs">{p.id}</td>
              <td>{p.displayName}</td>
              <td>{p.primaryRubricId}</td>
              <td className="font-mono text-xs">{p.didAgentEnvKey}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
