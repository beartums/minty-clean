module Sync

  module Serializer

    class << self
      def included(base)
        base.extend(ClassMethods)
      end
    end

    module ClassMethods
      # TODO: Attribute options -- key_name, format, value
      # TODO: Serializer options -- ignore_nils, formatter_to_use (JSON, JSONAPI, XML), always_array 

      attr_reader :_model_name, :_attributes, :_model_class

      def attribute(name, **options)
        @_attributes ||= {}
        name = name.to_sym
        @_attributes = @_attributes.merge(Hash[name, options])
      end

      def attributes(*args)
        args.each do |arg|
          if arg.is_a?(String) || arg.is_a?(Symbol)
            attribute arg
          else
            arg.each do |attr_key, attr_value|
              attribute attr_key, attr_value
            end
          end
        end
      end

      def model(model)
        @_model_name = model if model.is_a?(String)
        @_model_class = model if model.is_a?(Class)
      end

    end
    
    class UninitializedError < StandardError; end

    attr_reader :data

    def attributes
      self.class._attributes
    end

    def initialize(data)
      @data = data
    end

    def model_name
      self.class._model_name || self.class.name.gsub('Sync::', '').gsub('SyncSerializer', '')
    end

    def model_class
      self.class._model_class || model_name.classify.constantize
    end

    def model_attribute_names
      model_class.attribute_names
    end

    def attributes_to_serialize
      attrs = {}
      if attributes.nil? || attributes.empty?
        attrs.tap {|attributes_hash| model_attribute_names.each {|name| attributes_hash[name.to_sym] = {} }}
      else
        attrs = attributes
      end
      self.class.instance_methods(false).each { |m| attrs[m] = {} unless attrs.has_key?(m) }
      attrs
    end

    def as_json(*args)
      data = Array(@data)
      serializable_attributes = attributes_to_serialize
      data.map do |row|
        row_hash = serialize(row, serializable_attributes)
      end
    end

    def serialize(row, serializable_attributes)
      hash = {}
      serializable_attributes.each do |key, _|
        if self.respond_to?(key)
          if self.method(key).arity == 0
            hash[key] = self.send(key)
          else 
            hash[key] = self.send(key, row)
          end
        else
          hash[key] = row.send(key)
        end
      end
      hash
    end

  end

end
