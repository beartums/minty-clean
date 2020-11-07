module Zipfile
  class IncompleteCentralDirectory < StandardError
    def initialize(msg='Found fewer CentralDirectoryFileHeader entries than expected')
      super
    end
  end

  class CentralDirectory
    attr_reader :file_headers, :file_header_strings
    def initialize(data)
      @raw = data
      @file_headers = file_header_strings.map {|s| CentralDirectoryFileHeader.new(s)}
      raise IncompleteCentralDirectory if @file_headers.size < end_record.cd_records_total
    end

    def end_record
      @end_record ||= EndOfCentralDirectory.new(@raw)
    end

    def file_header_strings(data = nil)
      data ||= @raw
      pointer = data.length - end_record.size - end_record.cd_size
      last_start = nil
      strings = []
      while pointer < data.length - 3
        long = long_hex(data[pointer..pointer+3])
        if [CentralDirectoryFileHeader::SIGNATURE, EndOfCentralDirectory::SIGNATURE].include?(long)
          strings << data[last_start.. pointer-1] unless last_start.nil?
          last_start = pointer
          break if long == EndOfCentralDirectory::SIGNATURE
        end
        pointer += 1
      end
      strings
    end

    def long_hex(string)
      string.unpack('l*')[0].to_s(16)
    end

    def compressed_size
      @file_headers.reduce(0) {|tot, fh| tot += fh.compressed_size}
    end

    def uncompressed_size
      @file_headers.reduce(0) {|tot, fh| tot += fh.uncompressed_size}
    end


    private

  end
end