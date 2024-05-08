export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand: {
        Row: {
          id: string
          name: string
          provider_id: string | null
        }
        Insert: {
          id?: string
          name: string
          provider_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_brand_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
          parent: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          parent?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          parent?: string | null
        }
        Relationships: []
      }
      colors: {
        Row: {
          color: string
          id: string
          name: string
        }
        Insert: {
          color: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          discount: number | null
          id: string
          images: string[] | null
          price: number
          primary_color: string | null
          product_id: string
          secondary_color: string | null
          size: string | null
          stock: number
        }
        Insert: {
          discount?: number | null
          id?: string
          images?: string[] | null
          price: number
          primary_color?: string | null
          product_id: string
          secondary_color?: string | null
          size?: string | null
          stock?: number
        }
        Update: {
          discount?: number | null
          id?: string
          images?: string[] | null
          price?: number
          primary_color?: string | null
          product_id?: string
          secondary_color?: string | null
          size?: string | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_primary_color_fkey"
            columns: ["primary_color"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_secondary_color_fkey"
            columns: ["secondary_color"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_size_fkey"
            columns: ["size"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          created_at: string
          description: string | null
          feature: string[] | null
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          slug: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          feature?: string[] | null
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          slug: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          feature?: string[] | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          address: string | null
          city: string | null
          id: string
          name: string
          phone: string | null
          province: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          id?: string
          name: string
          phone?: string | null
          province?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          id?: string
          name?: string
          phone?: string | null
          province?: string | null
        }
        Relationships: []
      }
      sizes: {
        Row: {
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          size_guide: string | null
        }
        Insert: {
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          size_guide?: string | null
        }
        Update: {
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          size_guide?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_type: "Hombres" | "Mujeres" | "Niños" | "Unisex"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
