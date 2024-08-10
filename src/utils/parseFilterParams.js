const parseIsFavourite = (favourite) => {
  if (typeof favourite !== 'string') return;
  if (['true', 'false'].includes(favourite)) {
    return favourite === 'true'; // Convert to boolean
  }
};

const parseType = (contactType) => {
  if (typeof contactType !== 'string') return;
  const validTypes = ['work', 'personal', 'home'];
  if (validTypes.includes(contactType)) {
    return contactType;
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  return {
    type: parseType(type),
    isFavourite: parseIsFavourite(isFavourite),
  };
};
