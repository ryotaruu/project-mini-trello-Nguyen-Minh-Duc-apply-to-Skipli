export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    disabled?: boolean;
    maxHeight?: string;
    showSelectAll?: boolean;
    emptyMessage?: string;
}