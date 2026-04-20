import { LayersPlusIcon } from "lucide-react";
import { Button } from "./button";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Spinner } from "./spinner";
import RequiredLabel from "./required-label";

export type SelectOption = { value: string; label: string };


export type SelectFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[] | undefined;
    isLoading?: boolean;
    disabled?: boolean;
    hasError?: boolean;
    onAdd?: () => void;
    required?: boolean;
    emptyMessage?: string;
};

export function SelectField({
    label,
    placeholder,
    value,
    onChange,
    options,
    isLoading = false,
    disabled = false,
    hasError = false,
    onAdd,
    required = false,
    emptyMessage = "Aucune option disponible",
}: SelectFieldProps) {
    return (
        <FormItem>
            <FormLabel className="text-neutral-600">
                {label}
                {required && <RequiredLabel />}
            </FormLabel>
            <FormControl>
                <div className="flex gap-x-2">
                    <Select onValueChange={onChange} value={value} disabled={disabled}>
                        <SelectTrigger className="w-full" aria-invalid={hasError}
                            hasValue={!!value}
                            onClear={() => onChange("")}
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent position="popper" align="end">
                            {isLoading ? (
                                <div className="flex justify-center items-center p-2">
                                    <Spinner />
                                </div>
                            ) : options && options.length > 0 ? (
                                options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="__empty__" disabled>
                                    {emptyMessage}
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {onAdd && (
                        <Button
                            onClick={onAdd}
                            type="button"
                            variant="outline"
                            className="h-10 shadow-none"
                        >
                            <LayersPlusIcon />
                        </Button>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
