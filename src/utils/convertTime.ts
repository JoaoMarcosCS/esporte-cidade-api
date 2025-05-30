export const timeToMinute = (timeStr: string):number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}