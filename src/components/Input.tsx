
type InputType = {
    value: string;
    onChange: (value: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    type?: 'text' | 'password' | 'email';
    col?: string;
    name: string;
    label: string;
    autoComplete?: string;
}

const Input = (props: InputType) => {
    const { value, onChange, type = 'text', col = 'col-12', name, label, autoComplete, onBlur } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <div className={col}>
            <div className="form-floating">
                <input
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    type={type}
                    className={`form-control`}
                    id={name}
                    placeholder="ddwadw"
                    autoComplete={autoComplete}
                />
                <label htmlFor={name}>{label}</label>
            </div>
        </div>
    )
}

export default Input;