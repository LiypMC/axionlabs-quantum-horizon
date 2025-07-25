import { useMemo } from "react";
import { CheckCircle2, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export function PasswordStrengthIndicator({ password, show }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let label = "";
    let color = "";
    
    if (score <= 2) {
      label = "Weak";
      color = "text-red-400";
    } else if (score <= 3) {
      label = "Fair";
      color = "text-yellow-400";
    } else if (score <= 4) {
      label = "Good";
      color = "text-blue-400";
    } else {
      label = "Strong";
      color = "text-green-400";
    }

    return { score, label, color, checks };
  }, [password]);

  if (!show || !password) return null;

  return (
    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/70 text-sm">Password Strength:</span>
        <span className={`text-sm font-medium ${strength.color}`}>
          {strength.label}
        </span>
      </div>
      
      {/* Strength Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength.score <= 2
              ? "bg-red-400"
              : strength.score <= 3
              ? "bg-yellow-400"
              : strength.score <= 4
              ? "bg-blue-400"
              : "bg-green-400"
          }`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>

      {/* Requirements */}
      <div className="space-y-1">
        <RequirementItem
          met={strength.checks?.length || false}
          text="At least 8 characters"
        />
        <RequirementItem
          met={strength.checks?.lowercase || false}
          text="One lowercase letter"
        />
        <RequirementItem
          met={strength.checks?.uppercase || false}
          text="One uppercase letter"
        />
        <RequirementItem
          met={strength.checks?.number || false}
          text="One number"
        />
        <RequirementItem
          met={strength.checks?.special || false}
          text="One special character"
        />
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="w-3 h-3 text-green-400" />
      ) : (
        <X className="w-3 h-3 text-white/40" />
      )}
      <span className={met ? "text-green-400" : "text-white/60"}>
        {text}
      </span>
    </div>
  );
}