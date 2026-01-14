import { defineConfig } from '@prisma/config';

// Función simple para decidir la URL
function getDbUrl() {
  const args = process.argv.join(' ');
  
  // Si es el schema de academico -> Base EducationalDataBase
  if (args.includes('academico.prisma')) {
    return "postgresql://postgres:090306@localhost:5432/academico_db";
  }
  
  // Si es el schema de estudiantes -> Base StudentDataBase
  if (args.includes('estudiantes.prisma')) {
    return "postgresql://postgres:090306@localhost:5432/estudiantes_db";
  }

  // Si es cualquier otro -> Base UniversityDataBase
  return "postgresql://postgres:090306@localhost:5432/universidad_db";
}

export default defineConfig({
  datasource: {
    url: getDbUrl(),
  },
});