export function levelLog(
    event,
    data = {}
) {
    console.log(
        `[LEVEL] ${event}`,
        data
    );
}