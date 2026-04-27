import { Search, Eye, Trash2 } from 'lucide-react';
import type { User } from './_shared/types';

interface UsersTabProps {
  users: User[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setViewingUser: (u: User | null) => void;
  deleteUserMutation: { mutate: (id: string) => void };
}

export default function UsersTab({ users, searchQuery, setSearchQuery, setViewingUser, deleteUserMutation }: UsersTabProps) {
  return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-zinc-500 w-64"
                    data-testid="input-search-users"
                  />
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Kullanıcı</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">E-posta</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Telefon</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Kayıt Tarihi</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-neutral-200 hover:bg-neutral-50/30" data-testid={`row-user-${user.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold">
                              {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-neutral-900">
                              {user.firstName} {user.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-500">{user.email}</td>
                        <td className="px-6 py-4 text-neutral-500">{user.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm text-neutral-500">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setViewingUser(user)}
                              className="p-2 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-500 hover:text-neutral-900"
                              data-testid={`button-view-user-${user.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) deleteUserMutation.mutate(user.id); }}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-500 hover:text-red-400"
                              data-testid={`button-delete-user-${user.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                          Kullanıcı bulunamadı
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  );
}
