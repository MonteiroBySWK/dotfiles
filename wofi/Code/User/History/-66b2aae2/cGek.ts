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
  QueryConstraint,
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

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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
        converted[key] = value.toDate()
      } else {
        converted[key] = value
      }
    }
    
    return converted as T
  }

  protected prepareForFirestore(data: Partial<T>): DocumentData {
    const prepared: DocumentData = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Date) {
        prepared[key] = value
      } else {
        prepared[key] = value
      }
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
    
    // Apply filters
    for (const filter of filters) {
      q = query(q, where(filter.field, filter.operator, filter.value))
    }
    
    // Apply ordering
    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))
    }
    
    // Apply limit
    if (options?.limit) {
      q = query(q, firestoreLimit(options.limit))
    }
    
    return this.executeQuery(q)
  }

  async findPaginated(
    filters: QueryFilter[] = [], 
    options: PaginationOptions & { orderBy?: { field: string; direction: 'asc' | 'desc' } } = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<T>> {
    const { page, limit: pageLimit, orderBy: orderByOption } = options
    const offset = (page - 1) * pageLimit

    // Get total count (simplified - in production you might want to optimize this)
    const totalData = await this.findWhere(filters)
    const total = totalData.length

    // Get paginated data
    let q: Query<DocumentData> = this.getCollectionRef()
    
    // Apply filters
    for (const filter of filters) {
      q = query(q, where(filter.field, filter.operator, filter.value))
    }
    
    // Apply ordering
    if (orderByOption) {
      q = query(q, orderBy(orderByOption.field, orderByOption.direction))
    }
    
    // Apply pagination
    q = query(q, firestoreLimit(pageLimit))
    
    const data = await this.executeQuery(q)
    
    return {
      data: data.slice(offset, offset + pageLimit),
      pagination: {
        page,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit)
      }
    }
  }

  protected async executeQuery(q: Query<DocumentData>): Promise<T[]> {
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ ...doc.data(), id: doc.id })
    )
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error)
      throw error
    }
  }

  // Create new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = serverTimestamp()
      const docData = this.prepareForFirestore({
        ...data,
        createdAt: now,
        updatedAt: now
      } as Record<string, unknown>)
      
      const docRef = await addDoc(collection(db, this.collectionName), docData)
      return docRef.id
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error)
      throw error
    }
  }

  // Update document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const updateData = this.prepareForFirestore({
        ...data,
        updatedAt: serverTimestamp()
      } as Record<string, unknown>)
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error)
      throw error
    }
  }

  // Delete document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error)
      throw error
    }
  }

  // Listen to collection changes
  onSnapshot(
    callback: (data: T[]) => void,
    options?: QueryOptions
  ): Unsubscribe {
    const constraints = this.buildQuery(options)
    const q = query(collection(db, this.collectionName), ...constraints)
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() })
      )
      callback(data)
    }, (error) => {
      console.error(`Error listening to ${this.collectionName} changes:`, error)
    })
  }

  // Listen to document changes
  onDocumentSnapshot(
    id: string,
    callback: (data: T | null) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, id)
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = this.convertTimestamps({ id: docSnap.id, ...docSnap.data() })
        callback(data)
      } else {
        callback(null)
      }
    }, (error) => {
      console.error(`Error listening to document ${id} in ${this.collectionName}:`, error)
    })
  }

  // Count documents
  async count(options?: QueryOptions): Promise<number> {
    try {
      const constraints = this.buildQuery(options)
      const q = query(collection(db, this.collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.size
    } catch (error) {
      console.error(`Error counting documents in ${this.collectionName}:`, error)
      throw error
    }
  }

  // Check if document exists
  async exists(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists()
    } catch (error) {
      console.error(`Error checking if document ${id} exists in ${this.collectionName}:`, error)
      throw error
    }
  }
}