import React, { useState, useMemo } from 'react';
import { PreregistrationCleanup } from '../PreregistrationCleanup';
import { normalizeText } from '../../../utils/searchUtils';

export function PreRegistrationsTab({
  registrations,
  setRegistrations,
  loadingRegs,
  onStatusChange,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtrado reactivo en memoria (sin costo de cuota de red)
  const filteredRegs = useMemo(() => {
    return registrations.filter(reg => {
      // Filtro de estado
      const matchesStatus = statusFilter === 'ALL' || (reg.status || 'PENDIENTE').toUpperCase() === statusFilter.toUpperCase();
      
      // Búsqueda por texto libre insensible a acentos y mayúsculas
      const search = normalizeText(searchTerm);
      if (!search) return matchesStatus;

      const matchesSearch = 
        normalizeText(reg.fullName).includes(search) ||
        normalizeText(reg.phone).includes(search) ||
        normalizeText(reg.email).includes(search) ||
        normalizeText(reg.courseTitle).includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [registrations, searchTerm, statusFilter]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Aspirantes y Solicitudes de Pre-registro
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gestiona el estatus de las solicitudes enviadas por los alumnos desde la página web.
          </p>
        </div>
      </div>

      {/* Utilidad de Depuración y Optimización de Cuotas */}
      <PreregistrationCleanup
        registrations={registrations}
        filteredRegistrations={filteredRegs}
        setRegistrations={setRegistrations}
        showToast={showToast}
      />

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-gray-50 dark:bg-gray-900/40 p-3 rounded-2xl border border-gray-100/80 dark:border-gray-700/50">
        <div className="relative flex-1 w-full">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono, correo o curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-650 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cecati text-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-650 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cecati text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="CONTACTADO">CONTACTADO</option>
            <option value="INSCRITO">INSCRITO</option>
            <option value="DESCARTADO">DESCARTADO</option>
          </select>
        </div>
      </div>

      {loadingRegs ? (
        <div className="text-center py-12 space-y-3">
          <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
          <p className="text-sm text-gray-500">Cargando solicitudes de alumnos...</p>
        </div>
      ) : filteredRegs.length === 0 ? (
        <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
          <i className="ri-inbox-line text-4xl block"></i>
          <p className="text-sm font-medium">No se encontraron solicitudes con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Aspirante</th>
                <th className="py-3 px-2">Curso Solicitado</th>
                <th className="py-3 px-2">Contacto</th>
                <th className="py-3 px-2">Fecha</th>
                <th className="py-3 px-2">Estatus</th>
                <th className="py-3 px-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
              {filteredRegs.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">{reg.fullName}</td>
                  <td className="py-3 px-2">{reg.courseTitle}</td>
                  <td className="py-3 px-2 space-y-0.5">
                    <div className="font-mono text-xs">{reg.phone}</div>
                    {reg.email && <div className="text-[11px] text-gray-400">{reg.email}</div>}
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-500">
                    {reg.createdAt ? (typeof reg.createdAt === 'string' ? reg.createdAt.split('T')[0] : new Date(reg.createdAt.seconds * 1000).toLocaleDateString('es-MX')) : 'Reciente'}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      reg.status === 'INSCRITO' 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300' 
                        : reg.status === 'CONTACTADO' 
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300' 
                        : reg.status === 'DESCARTADO'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300'
                    }`}>
                      {reg.status || 'PENDIENTE'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <select
                      value={reg.status || 'PENDIENTE'}
                      onChange={(e) => onStatusChange(reg.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold focus:outline-none"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="CONTACTADO">CONTACTADO</option>
                      <option value="INSCRITO">INSCRITO</option>
                      <option value="DESCARTADO">DESCARTADO</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

