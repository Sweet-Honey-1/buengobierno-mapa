import { cn } from '../../lib/utils'

type Props = {
  path: string
  label: string
  isSelected: boolean
  intensity: number
  onClick: () => void
}

export function DepartmentShape({ path, label, isSelected, intensity, onClick }: Props) {
  const fill = isSelected
    ? '#b91c1c'
    : intensity > 80
      ? '#dc2626'
      : intensity > 45
        ? '#f59e0b'
        : intensity > 0
          ? '#fde68a'
          : '#fff7ed'

  return (
    <g className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]" onClick={onClick}>
      <path d={path} fill={fill} stroke="#991b1b" strokeWidth="2" className={cn(isSelected && 'drop-shadow-[0_0_12px_rgba(220,38,38,0.4)]')}>
        <title>{label}</title>
      </path>
    </g>
  )
}