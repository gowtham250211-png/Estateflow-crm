import api from './api';

export const propertyService = {
  getProjects: () => api.get('/properties/projects'),
  getBuildings: (projectId) => api.get(`/properties/projects/${projectId}/buildings`),
  getUnits: (buildingId) => api.get(`/properties/buildings/${buildingId}/units`),
};