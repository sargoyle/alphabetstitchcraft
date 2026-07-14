export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type WorkspaceRole = "owner" | "editor" | "viewer";
export type FontSourceType = "default" | "custom";
export type ExportFormat = "png" | "json";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          updated_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          updated_at?: string;
        };
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: WorkspaceRole;
          created_at: string;
        };
        Insert: {
          workspace_id: string;
          user_id: string;
          role?: WorkspaceRole;
          created_at?: string;
        };
        Update: {
          role?: WorkspaceRole;
        };
      };
      default_fonts: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          default_height: number;
          default_width: number | null;
          recommended_use: string;
          licence: string;
          characters: Json;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          category: string;
          default_height: number;
          default_width: number | null;
          recommended_use: string;
          licence: string;
          characters: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          category?: string;
          default_height?: number;
          default_width?: number | null;
          recommended_use?: string;
          licence?: string;
          characters?: Json;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      custom_fonts: {
        Row: {
          id: string;
          owner_id: string | null;
          workspace_id: string | null;
          base_default_font_id: string | null;
          base_custom_font_id: string | null;
          name: string;
          description: string;
          category: string;
          default_height: number;
          default_width: number | null;
          recommended_use: string;
          licence: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          workspace_id?: string | null;
          base_default_font_id?: string | null;
          base_custom_font_id?: string | null;
          name: string;
          description?: string;
          category: string;
          default_height: number;
          default_width?: number | null;
          recommended_use?: string;
          licence?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          workspace_id?: string | null;
          name?: string;
          description?: string;
          category?: string;
          default_height?: number;
          default_width?: number | null;
          recommended_use?: string;
          licence?: string;
          updated_at?: string;
        };
      };
      custom_font_characters: {
        Row: {
          id: string;
          font_id: string;
          owner_id: string | null;
          character_key: string;
          width: number;
          height: number;
          grid: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          font_id: string;
          owner_id?: string | null;
          character_key: string;
          width: number;
          height: number;
          grid: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          width?: number;
          height?: number;
          grid?: Json;
          updated_at?: string;
        };
      };
      custom_font_backups: {
        Row: {
          id: string;
          font_id: string;
          action: "update" | "delete" | "restore";
          font_name: string;
          font_snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          font_id: string;
          action: "update" | "delete" | "restore";
          font_name: string;
          font_snapshot: Json;
          created_at?: string;
        };
        Update: {
          action?: "update" | "delete" | "restore";
          font_name?: string;
          font_snapshot?: Json;
        };
      };
      generated_patterns: {
        Row: {
          id: string;
          owner_id: string;
          workspace_id: string | null;
          title: string;
          font_source: FontSourceType;
          default_font_id: string | null;
          custom_font_id: string | null;
          text_content: string;
          options: Json;
          width: number;
          height: number;
          grid: Json;
          unsupported_characters: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          workspace_id?: string | null;
          title?: string;
          font_source: FontSourceType;
          default_font_id?: string | null;
          custom_font_id?: string | null;
          text_content: string;
          options?: Json;
          width: number;
          height: number;
          grid: Json;
          unsupported_characters?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          workspace_id?: string | null;
          title?: string;
          text_content?: string;
          options?: Json;
          width?: number;
          height?: number;
          grid?: Json;
          unsupported_characters?: string[];
          updated_at?: string;
        };
      };
      generator_settings: {
        Row: {
          owner_id: string;
          selected_default_font_id: string | null;
          selected_custom_font_id: string | null;
          text_content: string;
          letter_spacing: number;
          word_spacing: number;
          line_spacing: number;
          alignment: "left" | "center" | "right";
          show_grid: boolean;
          show_filled: boolean;
          zoom: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          owner_id: string;
          selected_default_font_id?: string | null;
          selected_custom_font_id?: string | null;
          text_content?: string;
          letter_spacing?: number;
          word_spacing?: number;
          line_spacing?: number;
          alignment?: "left" | "center" | "right";
          show_grid?: boolean;
          show_filled?: boolean;
          zoom?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          selected_default_font_id?: string | null;
          selected_custom_font_id?: string | null;
          text_content?: string;
          letter_spacing?: number;
          word_spacing?: number;
          line_spacing?: number;
          alignment?: "left" | "center" | "right";
          show_grid?: boolean;
          show_filled?: boolean;
          zoom?: number;
          updated_at?: string;
        };
      };
      pattern_exports: {
        Row: {
          id: string;
          owner_id: string;
          pattern_id: string;
          format: ExportFormat;
          storage_path: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pattern_id: string;
          format: ExportFormat;
          storage_path?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          storage_path?: string | null;
          metadata?: Json;
        };
      };
    };
  };
};
