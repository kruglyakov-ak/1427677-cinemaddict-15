import dayjs from 'dayjs';

export const formatReleaseDate = (date, format) => dayjs(date).format(format);

