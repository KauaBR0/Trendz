import type { EditorialWorkflowStatus } from '../../types';

export const editorialStatusLabels: Record<EditorialWorkflowStatus, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em revisao',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
  travado: 'Travado',
  em_resolucao: 'Em resolucao',
  resolvido: 'Resolvido',
  cancelado: 'Cancelado',
};

export const editorialStatusStyles: Record<EditorialWorkflowStatus, string> = {
  rascunho: 'border border-gray-700 bg-gray-500/10 text-gray-300',
  em_revisao: 'border border-amber-500/20 bg-amber-500/10 text-amber-300',
  aprovado: 'border border-sky-500/20 bg-sky-500/10 text-sky-300',
  publicado: 'border border-lime-500/20 bg-lime-500/10 text-lime-300',
  travado: 'border border-orange-500/20 bg-orange-500/10 text-orange-300',
  em_resolucao: 'border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300',
  resolvido: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  cancelado: 'border border-red-500/20 bg-red-500/10 text-red-300',
};

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function isEditorialLive(status: EditorialWorkflowStatus) {
  return status === 'publicado' || status === 'travado' || status === 'em_resolucao';
}
