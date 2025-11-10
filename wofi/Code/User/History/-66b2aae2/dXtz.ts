import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp,
  QueryDocumentSnapshot,
  onSnapshot,
  Unsubscribe,
  WhereFilterOp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface QueryOptions {
  where?: Array<{ field: string; operator: WhereFilterOp; value: unknown }>
  orderBy?: Array<{ field: string; direction: 'asc' | 'desc' }>
  limit?: number
  startAfter?: DocumentSnapshot
}

export interface PaginationResult<T> {
  data: T[]
  lastDoc?: QueryDocumentSnapshot
  hasMore: boolean
  total?: number
}

export class BaseRepository<T> {
  protected collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  // Convert Firestore timestamp to Date
  protected convertTimestamps(data: Record<string, unknown>): T {
    const result = { ...data }
    
    Object.keys(result).forEach(key => {
      if (result[key] instanceof Timestamp) {
        result[key] = (result[key] as Timestamp).toDate()
      } else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = this.convertTimestamps(result[key] as Record<string, unknown>)
      }
    })
    
    return result as T
  }

  // Convert Date to Firestore timestamp for writing
  protected prepareForFirestore(data: Record<string, unknown>): Record<string, unknown> {
    const result = { ...data }
    
    Object.keys(result).forEach(key => {
      if (result[key] instanceof Date) {
        result[key] = Timestamp.fromDate(result[key] as Date)
      } else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = this.prepareForFirestore(result[key] as Record<string, unknown>)
      }
    })
    
    return result
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