type ButtonType = {
    text: string;
    type?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button = (props: ButtonType) => {
    const { text, type = 'primary', onClick, disabled } = props;

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            className={`btn btn-${type}`}
            type="submit"
            onClick={disabled ? undefined : handleClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
}

export default Button;
