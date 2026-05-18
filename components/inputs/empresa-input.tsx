'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRoiStore } from '@/lib/store/roi'

export function EmpresaInput() {
  const empresa = useRoiStore(s => s.inputs.empresa)
  const setEmpresa = useRoiStore(s => s.setEmpresa)

  return (
    <div className="space-y-2">
      <Label htmlFor="empresa-input">🏷️ Nombre de tu empresa</Label>
      <Input
        id="empresa-input"
        type="text"
        placeholder="ej. Tecno Latam SAS"
        value={empresa}
        onChange={e => setEmpresa(e.target.value)}
        maxLength={120}
        aria-describedby="empresa-help"
      />
      <p id="empresa-help" className="text-xs text-zinc-500 dark:text-zinc-400">
        Aparecerá en el PDF + imagen de share
      </p>
    </div>
  )
}
