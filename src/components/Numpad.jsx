const Numpad = (props) => {
    const {
        value,
        onChange,
        length,
        onSubmit
    } = props;

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, null];

    const handleClick = (number) => {
        const newValue = value + number;

        if (newValue.length < length) {
            onChange(newValue);
        } else if (newValue.length === length) {
            onChange(newValue);
            onSubmit(newValue);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <div className="d-flex gap-2">
                {Array.from({ length }, (_, i) => (
                    <span
                        key={i}
                        className={`pin-dot ${value[i] ? 'bg-white' : ''}`}
                    />
                ))}
            </div>
            <div className="numpad mt-5">
                {numbers.map((number, index) => (
                    <div
                        key={index}
                        className={`${number !== null ? 'numpad-item' : ''}`}
                        onClick={() => number !== null && handleClick(number)}
                    >
                        {number}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Numpad;