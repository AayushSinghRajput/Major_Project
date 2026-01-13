export const formatAcademicId = (id, createdAt) => {
  if (!id) return "STUDENT-ID";
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const facultyCode = "SCI";
  const serial = id.substring(id.length - 6).toUpperCase();

  return `${year}-${facultyCode}-${serial}`;
};

export const getCleanUsername = (user) => {
  if (!user) return "User";
  if (user.username) return user.username.trim();
  return "Student";
};