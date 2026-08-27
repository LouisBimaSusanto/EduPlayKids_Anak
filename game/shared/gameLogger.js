export function gameLog(
    event,
    data = {}
) {
    if (
        process.env.NODE_ENV ===
        'production'
    ) {
        return;
    }

    console.log(
        `[GAME] ${event}`,
        data
    );
}

export default gameLog;