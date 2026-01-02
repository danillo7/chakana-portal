import { create } from 'zustand'
import type { Document, Project, Action, Stakeholder } from '../types'

// Import data
import documentsData from '../data/documents.json'
import projectsData from '../data/projects.json'
import actionsData from '../data/actions.json'
import stakeholdersData from '../data/stakeholders.json'

interface DataState {
  // Documents
  documents: Document[]
  selectedDocument: Document | null
  setSelectedDocument: (doc: Document | null) => void

  // Projects
  projects: Project[]
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void

  // Actions
  actions: Action[]
  updateActionStatus: (id: string, status: Action['status']) => void

  // Stakeholders
  stakeholders: Stakeholder[]
  selectedStakeholder: Stakeholder | null
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => void

  // Filters
  filterByProject: (projectId: string | null) => void
  currentProjectFilter: string | null
}

export const useDataStore = create<DataState>((set) => ({
  // Documents
  documents: documentsData as Document[],
  selectedDocument: null,
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),

  // Projects
  projects: projectsData as Project[],
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  // Actions
  actions: actionsData as Action[],
  updateActionStatus: (id, status) => set((state) => ({
    actions: state.actions.map((action) =>
      action.id === id ? { ...action, status } : action
    ),
  })),

  // Stakeholders
  stakeholders: stakeholdersData as Stakeholder[],
  selectedStakeholder: null,
  setSelectedStakeholder: (stakeholder) => set({ selectedStakeholder: stakeholder }),

  // Filters
  currentProjectFilter: null,
  filterByProject: (projectId) => set({ currentProjectFilter: projectId }),
}))
