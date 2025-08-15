import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    const score = Object.values(checks).filter(Boolean).length
    
    let level: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    if (score >= 5) level = 'strong'
    else if (score >= 4) level = 'good'
    else if (score >= 3) level = 'fair'

    return { checks, score, level }
  }, [password])

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Password Strength</span>
          <span className="capitalize text-muted-foreground">{strength.level}</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              {
                'strength-weak': strength.level === 'weak',
                'strength-fair': strength.level === 'fair',
                'strength-good': strength.level === 'good',
                'strength-strong': strength.level === 'strong',
              }
            )}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <PasswordRequirement
          met={strength.checks.length}
          text="At least 8 characters"
        />
        <PasswordRequirement
          met={strength.checks.lowercase}
          text="One lowercase letter"
        />
        <PasswordRequirement
          met={strength.checks.uppercase}
          text="One uppercase letter"
        />
        <PasswordRequirement
          met={strength.checks.number}
          text="One number"
        />
      </div>
    </div>
  )
}

interface PasswordRequirementProps {
  met: boolean
  text: string
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center space-x-2 text-xs">
      {met ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" />
      )}
      <span className={cn(
        met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
      )}>
        {text}
      </span>
    </div>
  )
}