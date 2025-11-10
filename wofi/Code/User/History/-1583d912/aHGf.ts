interface UserRepository {
  getAll();
  getById(id: string);

  update(payload: any);

  deleteById(id: string);
}
