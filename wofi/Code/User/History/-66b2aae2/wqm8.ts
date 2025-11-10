import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  onSnapshot,
  DocumentData,
  Query,
  Unsubscribe,
  FirestoreError,
  CollectionReference
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface QueryFilter {
  field: string
  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'
  value: unknown
}

export interface QueryOptions {
  orderBy?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
}

export abstract class BaseRepository<T extends { id: string }> {
  protected collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  protected getCollectionRef(): CollectionReference<DocumentData> {
    return collection(db, this.collectionName)
  }

  protected convertTimestamps(data: DocumentData): T {
    const converted: Record<string, unknown> = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === 'object' && 'toDate' in value) {
        converted[key] = (value as { toDate(): Date }).toDate()
      } else {
        converted[key] = value
      }
    }
    
    return converted as T
  }

  protected prepareForFirestore(data: Partial<T>): DocumentData {
    const prepared: DocumentData = {}
    
    for (const [key, value] of Object.entries(data)) {
      prepared[key] = value
    }
    
    return prepared
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    const docData = this.prepareForFirestore(data as Partial<T>)
    const docRef = await addDoc(this.getCollectionRef(), docData)
    return docRef.id
  }

  async findById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return this.convertTimestamps({ ...data, id: docSnap.id })
    }
    
    return null
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    const updateData = this.prepareForFirestore(data)
    await updateDoc(docRef, updateData)
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  async findAll(): Promise<T[]> {
    const querySnapshot = await getDocs(this.getCollectionRef())
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ ...doc.data(), id: doc.id })
    )
  }

  async findWhere(filters: QueryFilter[], options?: QueryOptions): Promise<T[]> {
    let q: Query<DocumentData> = this.getCollectionRef()
    
    for (const filter of filters) {
      q = query(q, where(filter.field, filter.operator, filter.value))
    }
    
    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))
    }
    
    if (options?.limit) {
      q = query(q, firestoreLimit(options.limit))
    }
    
    return this.executeQuery(q)
  }

  protected async executeQuery(q: Query<DocumentData>): Promise<T[]> {
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ ...doc.data(), id: doc.id })
    )
  }
}
