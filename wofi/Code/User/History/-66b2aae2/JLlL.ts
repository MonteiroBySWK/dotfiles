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
  where?: QueryFilter[]
  orderBy?: { field: string; direction: 'asc' | 'desc' }[]
  limit?: number
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  hasNext: boolean
  hasPrev: boolean
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
        // Convert Firestore Timestamp to Date
        converted[key] = (value as { toDate(): Date }).toDate()
      } else if (value && typeof value === 'string' && this.isDateField(key)) {
        // Convert ISO string dates to Date objects
        const date = new Date(value)
        converted[key] = isNaN(date.getTime()) ? new Date() : date
      } else if (value === null && this.isDateField(key)) {
        // Set default date for null date fields
        converted[key] = new Date()
      } else {
        converted[key] = value
      }
    }
    
    return converted as T
  }

  private isDateField(fieldName: string): boolean {
    const dateFields = ['createdAt', 'updatedAt', 'startDate', 'endDate', 'dueDate', 'completedAt', 'joinedAt', 'lastLogin']
    return dateFields.includes(fieldName)
  }

  protected prepareForFirestore(data: Partial<T>): DocumentData {
    const prepared: DocumentData = {}
    
    for (const [key, value] of Object.entries(data)) {
      // Skip undefined values - Firestore doesn't accept them
      if (value !== undefined) {
        prepared[key] = value
      }
    }
    
    return prepared
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    const now = new Date()
    const dataWithTimestamps = {
      ...data,
      createdAt: (data as any).createdAt || now,
      updatedAt: (data as any).updatedAt || now
    } as unknown as Partial<T>
    
    const docData = this.prepareForFirestore(dataWithTimestamps)
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

  // Alias for findById for backward compatibility
  async getById(id: string): Promise<T | null> {
    return this.findById(id)
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    const dataWithUpdatedAt = {
      ...data,
      updatedAt: new Date()
    }
    const updateData = this.prepareForFirestore(dataWithUpdatedAt)
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

  async findWhere(filters: QueryFilter[], options?: {
    orderBy?: { field: string; direction: 'asc' | 'desc' }
    limit?: number
  }): Promise<T[]> {
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

  async getAll(options?: {
    where?: QueryFilter[]
    orderBy?: { field: string; direction: 'asc' | 'desc' }[]
    limit?: number
  }): Promise<T[]> {
    if (!options || (!options.where && !options.orderBy && !options.limit)) {
      return this.findAll()
    }

    let q: Query<DocumentData> = this.getCollectionRef()
    
    if (options.where) {
      for (const filter of options.where) {
        q = query(q, where(filter.field, filter.operator, filter.value))
      }
    }
    
    if (options.orderBy) {
      for (const sort of options.orderBy) {
        q = query(q, orderBy(sort.field, sort.direction))
      }
    }
    
    if (options.limit) {
      q = query(q, firestoreLimit(options.limit))
    }
    
    return this.executeQuery(q)
  }

  async count(options?: {
    where?: QueryFilter[]
  }): Promise<number> {
    let q: Query<DocumentData> = this.getCollectionRef()
    
    if (options?.where) {
      for (const filter of options.where) {
        q = query(q, where(filter.field, filter.operator, filter.value))
      }
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  }

  async getPaginated(pageSize: number = 10, options?: QueryOptions): Promise<PaginationResult<T>> {
    let q: Query<DocumentData> = this.getCollectionRef()
    
    if (options?.where) {
      for (const filter of options.where) {
        q = query(q, where(filter.field, filter.operator, filter.value))
      }
    }
    
    if (options?.orderBy) {
      for (const sort of options.orderBy) {
        q = query(q, orderBy(sort.field, sort.direction))
      }
    }
    
    q = query(q, firestoreLimit(pageSize))
    
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map(doc => 
      this.convertTimestamps({ ...doc.data(), id: doc.id })
    )
    
    return {
      data,
      total: data.length,
      hasNext: data.length === pageSize,
      hasPrev: false // Simple implementation, would need more logic for proper pagination
    }
  }

  async exists(id: string): Promise<boolean> {
    const doc = await this.findById(id)
    return doc !== null
  }

  onSnapshot(
    options: QueryOptions | undefined,
    callback: (data: T[]) => void,
    errorCallback?: (error: FirestoreError) => void
  ): Unsubscribe {
    let q: Query<DocumentData> = this.getCollectionRef()
    
    if (options?.where) {
      for (const filter of options.where) {
        q = query(q, where(filter.field, filter.operator, filter.value))
      }
    }
    
    if (options?.orderBy) {
      for (const sort of options.orderBy) {
        q = query(q, orderBy(sort.field, sort.direction))
      }
    }
    
    if (options?.limit) {
      q = query(q, firestoreLimit(options.limit))
    }
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => 
          this.convertTimestamps({ ...doc.data(), id: doc.id })
        )
        callback(data)
      },
      errorCallback
    )
  }

  onDocumentSnapshot(
    id: string,
    callback: (data: T | null) => void,
    errorCallback?: (error: FirestoreError) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, id)
    
    return onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          callback(this.convertTimestamps({ ...data, id: docSnapshot.id }))
        } else {
          callback(null)
        }
      },
      errorCallback
    )
  }

  protected async executeQuery(q: Query<DocumentData>): Promise<T[]> {
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ ...doc.data(), id: doc.id })
    )
  }
}
