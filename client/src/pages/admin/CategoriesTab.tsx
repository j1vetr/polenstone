import { Plus, Trash2 } from 'lucide-react';
import type { Category } from './_shared/types';

interface CategoriesTabProps {
  categories: Category[];
  setEditingCategory: (c: Category | null) => void;
  setShowCategoryModal: (b: boolean) => void;
  deleteCategoryMutation: { mutate: (id: string) => void };
}

export default function CategoriesTab({ categories, setEditingCategory, setShowCategoryModal, deleteCategoryMutation }: CategoriesTabProps) {
  return (
            <div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                  data-testid="button-add-category"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Kategori
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden group" data-testid={`card-category-${category.id}`}>
                    {category.image && (
                      <div className="aspect-video relative overflow-hidden">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-neutral-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-neutral-500 mb-4">Slug: {category.slug}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingCategory(category); setShowCategoryModal(true); }}
                          className="flex-1 py-2 text-sm text-center bg-neutral-50 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-900"
                          data-testid={`button-edit-category-${category.id}`}
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => { if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) deleteCategoryMutation.mutate(category.id); }}
                          className="p-2 bg-neutral-50 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-500 hover:text-red-400"
                          data-testid={`button-delete-category-${category.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full text-center text-neutral-500 py-12">
                    Henüz kategori eklenmemiş
                  </div>
                )}
              </div>
            </div>
  );
}
