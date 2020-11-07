module Zipfile
  class InvalidCentralDirectoryFileHeaderRecord < StandardError
    def initialize(msg = "Raw data could not be parsed")
      super
    end
  end

  class CentralDirectoryFileHeader
    extend Forwardable
    attr_reader :values

    SIGNATURE = '2014b50'
    PARSE_STRING = 'ls6l3s5l2a*'
    FIXED_LENGTH = 46
    KEYS = %i(signature version_used version_needed bit_flag compression_method
          modified_time modified_date crc compressed_size uncompressed_size
          file_name_length extra_field_length file_comment_length file_start_disk
          internal_attributes external_attributes file_header_relative_offset string_data)

    delegate KEYS => :values

    def initialize(data)
      raise InvalidCentralDirectoryFileHeaderRecord unless valid?(data)
      @raw = strip_data(data)
      @values = parse
    end

    def parse(data = nil)
      data ||= @raw
      values = data.unpack(PARSE_STRING)
      OpenStruct.new(KEYS.zip(values).to_h)
    end

    def strip_data(data)
      struct = parse(data)
      data[0..variable_length(struct) + FIXED_LENGTH - 1]
    end

    def variable_length(struct = nil)
      struct ||= @values
      struct.file_name_length + struct.extra_field_length + struct.file_comment_length
    end

    def record_length
      FIXED_LENGTH + variable_length
    end

    def valid?(data = nil)
      data ||= @raw
      data.unpack('l*')[0].to_s(16) == SIGNATURE
    end

    def size
      FIXED_LENGTH + file_comment_length + file_name_length + extra_field_length
    end

    def file_comment
      return "" if file_comment_length == 0
      start = file_name_length + extra_field_length
      string_data[start..start + file_name_length - 1]
    end
    
    def extra_field
      return "" if extra_field_length == 0
      start = file_name_length
      string_data[start..start +extra_field_length - 1]
    end
    
    def file_name
      return "" if file_name_length == 0
      string_data[0..file_name_length-1]
    end
  end
end

