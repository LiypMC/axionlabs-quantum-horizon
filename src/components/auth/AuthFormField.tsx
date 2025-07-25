import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: string;
  required?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
}

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(
  ({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    success,
    required = false,
    className,
    showPasswordToggle = false,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password") 
      : type;

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={id} 
          className="text-white/90 font-medium flex items-center gap-2"
        >
          {label}
          {required && <span className="text-red-400">*</span>}
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              "h-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 transition-all duration-200",
              "focus:border-white/40 focus:bg-white/10",
              focused && "ring-2 ring-white/20",
              hasError && "border-red-400/50 focus:border-red-400 focus:ring-red-400/20",
              hasSuccess && "border-green-400/50 focus:border-green-400 focus:ring-green-400/20",
              showPasswordToggle && "pr-12"
            )}
            {...props}
          />
          
          {/* Success/Error Icons */}
          {(hasSuccess || hasError) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {hasSuccess && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              {hasError && <AlertCircle className="w-5 h-5 text-red-400" />}
            </div>
          )}
          
          {/* Password Toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        
        {/* Error Message */}
        {hasError && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {hasSuccess && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}
      </div>
    );
  }
);

AuthFormField.displayName = "AuthFormField";