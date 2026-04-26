import { type ReactNode, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/supabase";
import { Upload, Trash2, Pencil, Plus, X, Save } from "lucide-react";
import { OptimizedImage } from "./optimized-image";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-card rounded-xl border p-5 lg:p-6 ${className}`}>{children}</div>;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  const cls =
    "w-full px-3 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary text-sm";
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cls}
        />
      )}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full px-3 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary text-sm"
      />
    </label>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90 border",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
    ghost: "bg-transparent hover:bg-muted",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconButton({
  onClick,
  icon: Icon,
  label,
  variant = "ghost",
}: {
  onClick: () => void;
  icon: typeof Pencil;
  label: string;
  variant?: "ghost" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-2 rounded-md transition ${variant === "danger" ? "text-destructive hover:bg-destructive/10" : "hover:bg-muted"
        }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export { Upload, Trash2, Pencil, Plus, X, Save };

export function ImageUpload({
  value,
  onChange,
  bucket,
  prefix = "",
}: {
  value: string | null | undefined;
  onChange: (url: string) => void;
  bucket: string;
  prefix?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(bucket, file, prefix);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <OptimizedImage
            src={value}
            alt=""
            width={200}
            imgClassName="w-32 h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs"
            aria-label="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-background cursor-pointer hover:bg-muted text-sm">
        <Upload className="w-4 h-4" />
        {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
          disabled={uploading}
        />
      </label>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border shadow-xl w-full max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="p-5 border-t flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  label = "this item",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  label?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </>
      }
    >
      <p>
        Are you sure you want to delete <b>{label}</b>? This action cannot be undone.
      </p>
    </Modal>
  );
}

export function FormBlock({
  onSubmit,
  children,
  id,
  className = "",
}: {
  onSubmit: (e: FormEvent) => void | Promise<void>;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <form id={id} onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
}
