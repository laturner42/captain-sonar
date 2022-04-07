export default function ToolBelt(props) {

    const {
        height,
        children
    } = props;

    const width = 200;

    return (
        <div
            style={{
                marginLeft: 40,
                height,
                width,
                border: '10px solid #853',
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    )
}