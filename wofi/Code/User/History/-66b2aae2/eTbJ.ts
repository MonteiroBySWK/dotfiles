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

  // Build query constraints
  protected buildQuery(options?: QueryOptions): QueryConstraint[] {
    const constraints: QueryConstraint[] = []

    if (options?.where) {
      options.where.forEach(condition => {
        constraints.push(where(condition.field, condition.operator, condition.value))
      })
    }

    if (options?.orderBy) {
      options.orderBy.forEach(order => {
        constraints.push(orderBy(order.field, order.direction))
      })
    }

    if (options?.limit) {
      constraints.push(limit(options.limit))
    }

    if (options?.startAfter) {
      constraints.push(startAfter(options.startAfter))
    }

    return constraints
  }

  // Get all documents
  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      const constraints = this.buildQuery(options)
      const q = query(collection(db, this.collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() })
      )
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error)
      throw error
    }
  }

  // Get documents with pagination
  async getPaginated(pageSize: number = 10, options?: QueryOptions): Promise<PaginationResult<T>> {
    try {
      const constraints = this.buildQuery({
        ...options,
        limit: pageSize
      })
      
      const q = query(collection(db, this.collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      
      const data = querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() })
      )
      
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      const hasMore = querySnapshot.docs.length === pageSize

      return {
        data,
        lastDoc,
        hasMore
      }
    } catch (error) {
      console.error(`Error getting paginated documents from ${this.collectionName}:`, error)
      throw error
    }
  }

  // Get document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return this.convertTimestamps({ id: docSnap.id, ...docSnap.data() })
      }
      
      return null
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