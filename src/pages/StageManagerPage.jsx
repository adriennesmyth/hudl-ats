import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  GitBranch,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useStages } from '../hooks/useStages'

const PRESET_COLORS = [
  '#94A3B8', '#60A5FA', '#34D399', '#FBBF24',
  '#A78BFA', '#F472B6', '#FB923C', '#22C55E',
  '#EF4444', '#FF6600',
]

function StageFormFields({ register, errors, watchColor, setValue }) {
  return (
    <div className="space-y-4">
      <Input
        label="Stage Name"
        required
        placeholder="e.g. Technical Interview"
        error={errors.name?.message}
        {...register('name', { required: 'Stage name is required' })}
      />
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Colour <span className="text-hudl-orange">*</span>
        </label>
        <div className="flex gap-2 flex-wrap mb-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue('color', c, { shouldValidate: true })}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: watchColor === c ? '#1A1A1A' : 'transparent',
                boxShadow: watchColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
              }}
            />
          ))}
        </div>
        <Input
          placeholder="Or enter a custom hex: #FF6600"
          {...register('color', {
            required: 'Colour is required',
            pattern: { value: /^#[0-9A-Fa-f]{6}$/, message: 'Enter a valid hex colour' },
          })}
          error={errors.color?.message}
        />
      </div>
    </div>
  )
}

export function StageManagerPage() {
  const { stages, loading, fetchStages, createStage, updateStage, deleteStage, reorderStages } =
    useStages()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const addForm = useForm({ defaultValues: { color: '#94A3B8' } })
  const editForm = useForm()
  const addColor = addForm.watch('color')
  const editColor = editForm.watch('color')

  useEffect(() => {
    fetchStages()
  }, [fetchStages])

  const onAdd = async (data) => {
    setSaving(true)
    setError(null)
    try {
      await createStage(data)
      await fetchStages()
      addForm.reset({ color: '#94A3B8' })
      setShowAddModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (stage) => {
    setEditingId(stage.id)
    editForm.reset({ name: stage.name, color: stage.color })
  }

  const onEdit = async (data) => {
    setSaving(true)
    setError(null)
    try {
      await updateStage(editingId, data)
      await fetchStages()
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id) => {
    setSaving(true)
    setError(null)
    try {
      await deleteStage(id)
      await fetchStages()
      setDeleteConfirmId(null)
    } catch (err) {
      setError(err.message ?? 'Cannot delete — candidates may still be in this stage.')
    } finally {
      setSaving(false)
    }
  }

  const moveStage = async (index, direction) => {
    const reordered = [...stages]
    const target = index + direction
    if (target < 0 || target >= reordered.length) return
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    await reorderStages(reordered)
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={20} className="text-hudl-orange" />
            <h1 className="text-xl font-bold text-hudl-dark">Stage Manager</h1>
          </div>
          <p className="text-sm text-gray-500">
            Define and order the stages in your recruiting pipeline.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={14} />
          Add Stage
        </Button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stage list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-hudl-orange" size={24} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {stages.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              No stages yet. Add your first stage to get started.
            </div>
          )}
          {stages.map((stage, index) => (
            <div key={stage.id} className="px-5 py-4">
              {editingId === stage.id ? (
                <form onSubmit={editForm.handleSubmit(onEdit)}>
                  <StageFormFields
                    register={editForm.register}
                    errors={editForm.formState.errors}
                    watchColor={editColor}
                    setValue={editForm.setValue}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      <X size={12} />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveStage(index, -1)}
                      disabled={index === 0}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => moveStage(index, 1)}
                      disabled={index === stages.length - 1}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Color swatch */}
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />

                  {/* Name + order */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{stage.name}</p>
                    <p className="text-xs text-gray-400">Position {index + 1}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(stage)}
                      className="!p-2"
                    >
                      <Pencil size={14} />
                    </Button>
                    {deleteConfirmId === stage.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-red-500 mr-1">Delete?</span>
                        <Button
                          variant="danger"
                          size="sm"
                          className="!py-1"
                          onClick={() => onDelete(stage.id)}
                          disabled={saving}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="!py-1"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          No
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(stage.id)}
                        className="!p-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Stage Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Stage">
        <form onSubmit={addForm.handleSubmit(onAdd)}>
          <StageFormFields
            register={addForm.register}
            errors={addForm.formState.errors}
            watchColor={addColor}
            setValue={addForm.setValue}
          />
          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Stage
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
