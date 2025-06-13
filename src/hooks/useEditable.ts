import { useState, useCallback } from 'react';

export default function useEditable() {
    const [isEditable, setIsEditable] = useState(false);

    const handleBlur = useCallback(() => {
        setIsEditable(false);
    }, []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            setIsEditable(false);
        }
    }, []);

    const handleInputFocus = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
        event.target.select();
    }, []);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        // This function is intentionally empty as the actual change handling is done in the component
    }, []);

    return {
        isEditable,
        setIsEditable,
        handleBlur,
        handleKeyDown,
        handleInputFocus,
        handleInputChange
    };
} 