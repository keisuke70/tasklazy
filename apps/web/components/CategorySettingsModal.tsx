import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CategorySettings = {
  name: string
  defaultTime: number
  preferredTime: 'morning' | 'noon' | 'night'
}

export function CategorySettingsModal({ isOpen, onClose, category, onSave }) {
  const [settings, setSettings] = useState<CategorySettings>({
    name: '',
    defaultTime: 30,
    preferredTime: 'morning'
  })

  useEffect(() => {
    if (category) {
      setSettings(category)
    }
  }, [category])

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="defaultTime" className="text-right">
              Default Time (minutes)
            </Label>
            <Input
              id="defaultTime"
              type="number"
              value={settings.defaultTime}
              onChange={(e) => setSettings({ ...settings, defaultTime: parseInt(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="preferredTime" className="text-right">
              Preferred Time
            </Label>
            <Select
              value={settings.preferredTime}
              onValueChange={(value) => setSettings({ ...settings, preferredTime: value as 'morning' | 'noon' | 'night' })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="noon">Noon</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

