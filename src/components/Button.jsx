import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = (props) => {
    const {
        text,
        type = 'primary',
        onClick,
        style = {},
        disabled,
        classes,
        leftIcon,
        rightIcon,
        loading
    } = props;

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            className={`btn btn-${type} ${classes}`}
            type="submit"
            onClick={disabled ? undefined : handleClick}
            disabled={disabled}
            style={style}
        >
            
            {leftIcon ? (
                loading ? (
                    <span className="spinner-border spinner-border-sm ms-2" aria-hidden="true"></span>
                ) : (
                    <FontAwesomeIcon icon={["fal", leftIcon]} className={text ? "me-2" : ""} />
                )
            ) : null}
            {text}
            {rightIcon ? (
                loading ? (
                    <span className="spinner-border spinner-border-sm ms-2" aria-hidden="true"></span>
                ) : (
                    <FontAwesomeIcon icon={["fal", rightIcon]} className={text ? "ms-2" : ""} />
                )
            ) : null}
        </button>
    )
}

export default Button;
