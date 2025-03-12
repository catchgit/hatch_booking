const Input = (props) => {
    const { value, onChange, type = 'text', col = 'col-12', name, label, autoComplete, onBlur, placeholder } = props;

    const handleChange = (e) => {
        onChange(e.target.value);
    }

    return (
        <div className={col}>
            <div className="input-group">
                <input
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    type={type}
                    className={`form-control`}
                    id={name}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                />
            </div>
        </div>
    )
}

export default Input;