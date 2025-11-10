import { import { import { 

  collection, 

  doc,   collection,   collection, 

  addDoc, 

  updateDoc,   doc,   doc, 

  deleteDoc, 

  getDoc,   addDoc,   addDoc, 

  getDocs, 

  query,   updateDoc,   updateDoc, 

  where, 

  orderBy,   deleteDoc,   deleteDoc, 

  limit as firestoreLimit, 

  onSnapshot,  getDoc,   getDoc, 

  DocumentData,

  Query,  getDocs,   getDocs, 

  Unsubscribe,

  FirestoreError,  query,   query, 

  CollectionReference

} from 'firebase/firestore'  where,   where, 

import { db } from '@/lib/firebase'

  orderBy,   orderBy, 

export interface QueryFilter {

  field: string  limit as firestoreLimit,   limit as firestoreLimit, 

  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'

  value: unknown  onSnapshot,  onSnapshot,

}

  DocumentData,  QueryConstraint,

export interface QueryOptions {

  orderBy?: { field: string; direction: 'asc' | 'desc' }  Query,  DocumentData,

  limit?: number

}  Unsubscribe,  Query,



export interface PaginationOptions {  FirestoreError,  Unsubscribe,

  page: number

  limit: number  CollectionReference  FirestoreError,

}

} from 'firebase/firestore'  CollectionReference

export interface PaginatedResult<T> {

  data: T[]import { db } from '@/lib/firebase'} from 'firebase/firestore'

  pagination: {

    page: numberimport { db } from '@/lib/firebase'

    limit: number

    total: numberexport interface QueryFilter {

    totalPages: number

  }  field: stringexport interface QueryFilter {

}

  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'  field: string

export abstract class BaseRepository<T extends { id: string }> {

  protected collectionName: string  value: unknown  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'



  constructor(collectionName: string) {}  value: unknown

    this.collectionName = collectionName

  }}



  protected getCollectionRef(): CollectionReference<DocumentData> {export interface QueryOptions {

    return collection(db, this.collectionName)

  }  orderBy?: { field: string; direction: 'asc' | 'desc' }export interface QueryOptions {



  protected convertTimestamps(data: DocumentData): T {  limit?: number  orderBy?: { field: string; direction: 'asc' | 'desc' }

    const converted: Record<string, unknown> = {}

    }  limit?: number

    for (const [key, value] of Object.entries(data)) {

      if (value && typeof value === 'object' && 'toDate' in value) {}

        converted[key] = (value as { toDate(): Date }).toDate()

      } else {export interface PaginationOptions {

        converted[key] = value

      }  page: numberexport interface PaginationOptions {

    }

      limit: number  page: number

    return converted as T

  }}  limit: number



  protected prepareForFirestore(data: Partial<T>): DocumentData {}

    const prepared: DocumentData = {}

    export interface PaginatedResult<T> {

    for (const [key, value] of Object.entries(data)) {

      if (value instanceof Date) {  data: T[]export interface PaginatedResult<T> {

        prepared[key] = value

      } else {  pagination: {  data: T[]

        prepared[key] = value

      }    page: number  pagination: {

    }

        limit: number    page: number

    return prepared

  }    total: number    limit: number



  async create(data: Omit<T, 'id'>): Promise<string> {    totalPages: number    total: number

    const docData = this.prepareForFirestore(data as Partial<T>)

    const docRef = await addDoc(this.getCollectionRef(), docData)  }    totalPages: number

    return docRef.id

  }}  }



  async findById(id: string): Promise<T | null> {}

    const docRef = doc(db, this.collectionName, id)

    const docSnap = await getDoc(docRef)export abstract class BaseRepository<T extends { id: string }> {

    

    if (docSnap.exists()) {  protected collectionName: stringexport abstract class BaseRepository<T extends { id: string }> {

      const data = docSnap.data()

      return this.convertTimestamps({ ...data, id: docSnap.id })  protected collectionName: string

    }

      constructor(collectionName: string) {

    return null

  }    this.collectionName = collectionName  constructor(collectionName: string) {



  async update(id: string, data: Partial<T>): Promise<void> {  }    this.collectionName = collectionName

    const docRef = doc(db, this.collectionName, id)

    const updateData = this.prepareForFirestore(data)  }

    await updateDoc(docRef, updateData)

  }  protected getCollectionRef(): CollectionReference<DocumentData> {



  async delete(id: string): Promise<void> {    return collection(db, this.collectionName)  protected getCollectionRef(): CollectionReference<DocumentData> {

    const docRef = doc(db, this.collectionName, id)

    await deleteDoc(docRef)  }    return collection(db, this.collectionName)

  }

  }

  async findAll(): Promise<T[]> {

    const querySnapshot = await getDocs(this.getCollectionRef())  protected convertTimestamps(data: DocumentData): T {

    return querySnapshot.docs.map(doc => 

      this.convertTimestamps({ ...doc.data(), id: doc.id })    const converted: Record<string, unknown> = {}  protected convertTimestamps(data: DocumentData): T {

    )

  }        const converted: Record<string, unknown> = {}



  async findWhere(filters: QueryFilter[], options?: QueryOptions): Promise<T[]> {    for (const [key, value] of Object.entries(data)) {    

    let q: Query<DocumentData> = this.getCollectionRef()

          if (value && typeof value === 'object' && 'toDate' in value) {    for (const [key, value] of Object.entries(data)) {

    // Apply filters

    for (const filter of filters) {        converted[key] = (value as { toDate(): Date }).toDate()      if (value && typeof value === 'object' && 'toDate' in value) {

      q = query(q, where(filter.field, filter.operator, filter.value))

    }      } else {        converted[key] = value.toDate()

    

    // Apply ordering        converted[key] = value      } else {

    if (options?.orderBy) {

      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))      }        converted[key] = value

    }

        }      }

    // Apply limit

    if (options?.limit) {        }

      q = query(q, firestoreLimit(options.limit))

    }    return converted as T    

    

    return this.executeQuery(q)  }    return converted as T

  }

  }

  protected async executeQuery(q: Query<DocumentData>): Promise<T[]> {

    const querySnapshot = await getDocs(q)  protected prepareForFirestore(data: Partial<T>): DocumentData {

    return querySnapshot.docs.map(doc => 

      this.convertTimestamps({ ...doc.data(), id: doc.id })    const prepared: DocumentData = {}  protected prepareForFirestore(data: Partial<T>): DocumentData {

    )

  }        const prepared: DocumentData = {}



  // Real-time methods    for (const [key, value] of Object.entries(data)) {    

  subscribeToCollection(

    callback: (data: T[]) => void,      if (value instanceof Date) {    for (const [key, value] of Object.entries(data)) {

    errorCallback?: (error: FirestoreError) => void

  ): Unsubscribe {        prepared[key] = value      if (value instanceof Date) {

    return onSnapshot(

      this.getCollectionRef(),      } else {        prepared[key] = value

      (snapshot) => {

        const data = snapshot.docs.map(doc =>         prepared[key] = value      } else {

          this.convertTimestamps({ ...doc.data(), id: doc.id })

        )      }        prepared[key] = value

        callback(data)

      },    }      }

      errorCallback

    )        }

  }

    return prepared    

  subscribeToDocument(

    id: string,  }    return prepared

    callback: (data: T | null) => void,

    errorCallback?: (error: FirestoreError) => void  }

  ): Unsubscribe {

    const docRef = doc(db, this.collectionName, id)  async create(data: Omit<T, 'id'>): Promise<string> {

    return onSnapshot(

      docRef,    const docData = this.prepareForFirestore(data as Partial<T>)  async create(data: Omit<T, 'id'>): Promise<string> {

      (snapshot) => {

        if (snapshot.exists()) {    const docRef = await addDoc(this.getCollectionRef(), docData)    const docData = this.prepareForFirestore(data as Partial<T>)

          const data = this.convertTimestamps({ ...snapshot.data(), id: snapshot.id })

          callback(data)    return docRef.id    const docRef = await addDoc(this.getCollectionRef(), docData)

        } else {

          callback(null)  }    return docRef.id

        }

      },  }

      errorCallback

    )  async findById(id: string): Promise<T | null> {

  }

}    const docRef = doc(db, this.collectionName, id)  async findById(id: string): Promise<T | null> {

    const docSnap = await getDoc(docRef)    const docRef = doc(db, this.collectionName, id)

        const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {    

      const data = docSnap.data()    if (docSnap.exists()) {

      return this.convertTimestamps({ ...data, id: docSnap.id })      const data = docSnap.data()

    }      return this.convertTimestamps({ ...data, id: docSnap.id })

        }

    return null    

  }    return null

  }

  async update(id: string, data: Partial<T>): Promise<void> {

    const docRef = doc(db, this.collectionName, id)  async update(id: string, data: Partial<T>): Promise<void> {

    const updateData = this.prepareForFirestore(data)    const docRef = doc(db, this.collectionName, id)

    await updateDoc(docRef, updateData)    const updateData = this.prepareForFirestore(data)

  }    await updateDoc(docRef, updateData)

  }

  async delete(id: string): Promise<void> {

    const docRef = doc(db, this.collectionName, id)  async delete(id: string): Promise<void> {

    await deleteDoc(docRef)    const docRef = doc(db, this.collectionName, id)

  }    await deleteDoc(docRef)

  }

  async findAll(): Promise<T[]> {

    const querySnapshot = await getDocs(this.getCollectionRef())  async findAll(): Promise<T[]> {

    return querySnapshot.docs.map(doc =>     const querySnapshot = await getDocs(this.getCollectionRef())

      this.convertTimestamps({ ...doc.data(), id: doc.id })    return querySnapshot.docs.map(doc => 

    )      this.convertTimestamps({ ...doc.data(), id: doc.id })

  }    )

  }

  async findWhere(filters: QueryFilter[], options?: QueryOptions): Promise<T[]> {

    let q: Query<DocumentData> = this.getCollectionRef()  async findWhere(filters: QueryFilter[], options?: QueryOptions): Promise<T[]> {

        let q: Query<DocumentData> = this.getCollectionRef()

    // Apply filters    

    for (const filter of filters) {    // Apply filters

      q = query(q, where(filter.field, filter.operator, filter.value))    for (const filter of filters) {

    }      q = query(q, where(filter.field, filter.operator, filter.value))

        }

    // Apply ordering    

    if (options?.orderBy) {    // Apply ordering

      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))    if (options?.orderBy) {

    }      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))

        }

    // Apply limit    

    if (options?.limit) {    // Apply limit

      q = query(q, firestoreLimit(options.limit))    if (options?.limit) {

    }      q = query(q, firestoreLimit(options.limit))

        }

    return this.executeQuery(q)    

  }    return this.executeQuery(q)

  }

  async findPaginated(

    filters: QueryFilter[] = [],   async findPaginated(

    options: PaginationOptions & { orderBy?: { field: string; direction: 'asc' | 'desc' } } = { page: 1, limit: 10 }    filters: QueryFilter[] = [], 

  ): Promise<PaginatedResult<T>> {    options: PaginationOptions & { orderBy?: { field: string; direction: 'asc' | 'desc' } } = { page: 1, limit: 10 }

    const { page, limit: pageLimit, orderBy: orderByOption } = options  ): Promise<PaginatedResult<T>> {

    const offset = (page - 1) * pageLimit    const { page, limit: pageLimit, orderBy: orderByOption } = options

    const offset = (page - 1) * pageLimit

    // Get total count (simplified - in production you might want to optimize this)

    const totalData = await this.findWhere(filters)    // Get total count (simplified - in production you might want to optimize this)

    const total = totalData.length    const totalData = await this.findWhere(filters)

    const total = totalData.length

    // Get paginated data

    let q: Query<DocumentData> = this.getCollectionRef()    // Get paginated data

        let q: Query<DocumentData> = this.getCollectionRef()

    // Apply filters    

    for (const filter of filters) {    // Apply filters

      q = query(q, where(filter.field, filter.operator, filter.value))    for (const filter of filters) {

    }      q = query(q, where(filter.field, filter.operator, filter.value))

        }

    // Apply ordering    

    if (orderByOption) {    // Apply ordering

      q = query(q, orderBy(orderByOption.field, orderByOption.direction))    if (orderByOption) {

    }      q = query(q, orderBy(orderByOption.field, orderByOption.direction))

        }

    // Apply pagination    

    q = query(q, firestoreLimit(pageLimit))    // Apply pagination

        q = query(q, firestoreLimit(pageLimit))

    const data = await this.executeQuery(q)    

        const data = await this.executeQuery(q)

    return {    

      data: data.slice(offset, offset + pageLimit),    return {

      pagination: {      data: data.slice(offset, offset + pageLimit),

        page,      pagination: {

        limit: pageLimit,        page,

        total,        limit: pageLimit,

        totalPages: Math.ceil(total / pageLimit)        total,

      }        totalPages: Math.ceil(total / pageLimit)

    }      }

  }    }

  }

  protected async executeQuery(q: Query<DocumentData>): Promise<T[]> {

    const querySnapshot = await getDocs(q)  protected async executeQuery(q: Query<DocumentData>): Promise<T[]> {

    return querySnapshot.docs.map(doc =>     const querySnapshot = await getDocs(q)

      this.convertTimestamps({ ...doc.data(), id: doc.id })    return querySnapshot.docs.map(doc => 

    )      this.convertTimestamps({ ...doc.data(), id: doc.id })

  }    )

    } catch (error) {

  // Real-time methods      console.error(`Error getting document ${id} from ${this.collectionName}:`, error)

  subscribeToCollection(      throw error

    callback: (data: T[]) => void,    }

    errorCallback?: (error: FirestoreError) => void  }

  ): Unsubscribe {

    return onSnapshot(  // Create new document

      this.getCollectionRef(),  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {

      (snapshot) => {    try {

        const data = snapshot.docs.map(doc =>       const now = serverTimestamp()

          this.convertTimestamps({ ...doc.data(), id: doc.id })      const docData = this.prepareForFirestore({

        )        ...data,

        callback(data)        createdAt: now,

      },        updatedAt: now

      errorCallback      } as Record<string, unknown>)

    )      

  }      const docRef = await addDoc(collection(db, this.collectionName), docData)

      return docRef.id

  subscribeToDocument(    } catch (error) {

    id: string,      console.error(`Error creating document in ${this.collectionName}:`, error)

    callback: (data: T | null) => void,      throw error

    errorCallback?: (error: FirestoreError) => void    }

  ): Unsubscribe {  }

    const docRef = doc(db, this.collectionName, id)

    return onSnapshot(  // Update document

      docRef,  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {

      (snapshot) => {    try {

        if (snapshot.exists()) {      const docRef = doc(db, this.collectionName, id)

          const data = this.convertTimestamps({ ...snapshot.data(), id: snapshot.id })      const updateData = this.prepareForFirestore({

          callback(data)        ...data,

        } else {        updatedAt: serverTimestamp()

          callback(null)      } as Record<string, unknown>)

        }      

      },      await updateDoc(docRef, updateData)

      errorCallback    } catch (error) {

    )      console.error(`Error updating document ${id} in ${this.collectionName}:`, error)

  }      throw error

    }

  subscribeToQuery(  }

    filters: QueryFilter[],

    callback: (data: T[]) => void,  // Delete document

    options?: QueryOptions,  async delete(id: string): Promise<void> {

    errorCallback?: (error: FirestoreError) => void    try {

  ): Unsubscribe {      const docRef = doc(db, this.collectionName, id)

    let q: Query<DocumentData> = this.getCollectionRef()      await deleteDoc(docRef)

        } catch (error) {

    // Apply filters      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error)

    for (const filter of filters) {      throw error

      q = query(q, where(filter.field, filter.operator, filter.value))    }

    }  }

    

    // Apply ordering  // Listen to collection changes

    if (options?.orderBy) {  onSnapshot(

      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))    callback: (data: T[]) => void,

    }    options?: QueryOptions

      ): Unsubscribe {

    // Apply limit    const constraints = this.buildQuery(options)

    if (options?.limit) {    const q = query(collection(db, this.collectionName), ...constraints)

      q = query(q, firestoreLimit(options.limit))    

    }    return onSnapshot(q, (querySnapshot) => {

          const data = querySnapshot.docs.map(doc => 

    return onSnapshot(        this.convertTimestamps({ id: doc.id, ...doc.data() })

      q,      )

      (snapshot) => {      callback(data)

        const data = snapshot.docs.map(doc =>     }, (error) => {

          this.convertTimestamps({ ...doc.data(), id: doc.id })      console.error(`Error listening to ${this.collectionName} changes:`, error)

        )    })

        callback(data)  }

      },

      errorCallback  // Listen to document changes

    )  onDocumentSnapshot(

  }    id: string,

}    callback: (data: T | null) => void
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